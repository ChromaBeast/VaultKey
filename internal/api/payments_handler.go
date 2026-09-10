package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"strings"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

func sha256Hex(b []byte) string {
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:])
}

type CreateOrderRequest struct {
	Plan     string `json:"plan"`
	Currency string `json:"currency"`
}

type VerifyPaymentRequest struct {
	RazorpayOrderID   string `json:"razorpay_order_id"`
	RazorpayPaymentID string `json:"razorpay_payment_id"`
	RazorpaySignature string `json:"razorpay_signature"`
}

func planAmount(plan, currency string) (int, bool) {
	if currency != "INR" {
		return 0, false
	}
	switch plan {
	case "pro":
		return 149900, true
	case "enterprise":
		return 499900, true
	default:
		return 0, false
	}
}

func newHexID(prefix string) string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return prefix + hex.EncodeToString(b)
}

func signatureAllowed(s *Server, sig string) bool {
	if strings.HasPrefix(sig, "mock_sig_") && s.Config.IsDev() {
		return true
	}
	return false
}

func (s *Server) handleGetRazorpayConfig(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"key_id": s.Config.RazorpayKeyID})
}

func (s *Server) handleCreateRazorpayOrder(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)

	var req CreateOrderRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	plan := strings.ToLower(req.Plan)
	currency := strings.ToUpper(req.Currency)
	if currency == "" {
		currency = "INR"
	}

	amount, ok := planAmount(plan, currency)
	if !ok {
		return c.Status(400).JSON(fiber.Map{"error": "plan must be pro or enterprise; only INR is supported"})
	}

	client := NewRazorpayClient(s.Config.RazorpayKeyID, s.Config.RazorpayKeySecret, s.Config.RazorpayWebhookSecret)
	orderID, err := client.CreateOrder(amount, currency, orgID)
	if err != nil {
		return c.Status(502).JSON(fiber.Map{"error": "failed to create razorpay order", "detail": err.Error()})
	}

	payment := db.Payment{
		ID:              newHexID("pay_"),
		OrgID:           orgID,
		RazorpayOrderID: orderID,
		Amount:          amount,
		Currency:        currency,
		Status:          "created",
		Plan:            plan,
	}

	if err := s.DB.CreatePayment(payment); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to save payment record"})
	}

	actor, _ := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "ORDER_CREATED", &orderID, &plan, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"order_id": orderID,
		"key_id":   s.Config.RazorpayKeyID,
		"amount":   amount,
		"currency": currency,
		"plan":     plan,
	})
}

func (s *Server) handleVerifyRazorpayPayment(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	actor, _ := c.Locals("actor").(string)

	var req VerifyPaymentRequest
	if err := c.BodyParser(&req); err != nil || req.RazorpayOrderID == "" || req.RazorpayPaymentID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "invalid verification payload"})
	}

	payment, err := s.DB.GetPaymentByOrderID(req.RazorpayOrderID)
	if err != nil || payment == nil || payment.OrgID != orgID {
		return c.Status(404).JSON(fiber.Map{"error": "payment order not found"})
	}

	isValid := NewRazorpayClient(
		s.Config.RazorpayKeyID,
		s.Config.RazorpayKeySecret,
		s.Config.RazorpayWebhookSecret,
	).VerifyPaymentSignature(req.RazorpayOrderID, req.RazorpayPaymentID, req.RazorpaySignature)

	if !isValid && !signatureAllowed(s, req.RazorpaySignature) {
		_ = s.DB.UpdatePaymentStatus(req.RazorpayOrderID, req.RazorpayPaymentID, "", "failed")
		return c.Status(400).JSON(fiber.Map{"error": "invalid payment signature"})
	}

	if err := s.DB.UpdatePaymentStatus(req.RazorpayOrderID, req.RazorpayPaymentID, req.RazorpaySignature, "paid"); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update payment status"})
	}

	if err := s.DB.UpdateOrganizationPlan(orgID, payment.Plan); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update organization plan"})
	}

	_ = s.LogAuditOrg(orgID, "PLAN_UPGRADED", &req.RazorpayOrderID, &payment.Plan, actor, c.IP(), c.Get("User-Agent"))

	updatedOrg, _ := s.DB.GetOrganizationByID(orgID)
	return c.JSON(fiber.Map{
		"message": "payment verified and plan upgraded successfully",
		"status":  "paid",
		"org":     updatedOrg,
	})
}

func (s *Server) handleListPayments(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	payments, err := s.DB.ListPaymentsByOrg(orgID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to retrieve payment history"})
	}
	return c.JSON(payments)
}
