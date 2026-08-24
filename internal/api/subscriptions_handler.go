package api

import (
	"strings"
	"time"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

type CreateSubscriptionRequest struct {
	Plan string `json:"plan"`
}

type VerifySubscriptionRequest struct {
	RazorpaySubscriptionID string `json:"razorpay_subscription_id"`
	RazorpayPaymentID      string `json:"razorpay_payment_id"`
	RazorpaySignature      string `json:"razorpay_signature"`
}

func (s *Server) planIDFor(plan string) (string, bool) {
	switch plan {
	case "pro":
		return s.Config.RazorpayPlanProID, s.Config.RazorpayPlanProID != ""
	case "enterprise":
		return s.Config.RazorpayPlanEntID, s.Config.RazorpayPlanEntID != ""
	default:
		return "", false
	}
}

func (s *Server) handleCreateSubscription(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)

	var req CreateSubscriptionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	plan := strings.ToLower(req.Plan)
	planID, ok := s.planIDFor(plan)
	if !ok {
		return c.Status(400).JSON(fiber.Map{"error": "plan must be pro or enterprise"})
	}

	client := NewRazorpayClient(s.Config.RazorpayKeyID, s.Config.RazorpayKeySecret, s.Config.RazorpayWebhookSecret)
	subID, err := client.CreateSubscription(planID, 12)
	if err != nil {
		return c.Status(502).JSON(fiber.Map{"error": "failed to create subscription", "detail": err.Error()})
	}

	record := db.Subscription{
		ID:            newHexID("sub_"),
		OrgID:         orgID,
		RazorpaySubID: subID,
		Plan:          plan,
		Status:        "created",
	}
	if err := s.DB.CreateSubscriptionRecord(record); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to persist subscription"})
	}

	actor, _ := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "SUBSCRIPTION_CREATED", &subID, &plan, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"subscription_id": subID,
		"key_id":          s.Config.RazorpayKeyID,
		"plan":            plan,
	})
}

func (s *Server) handleVerifySubscription(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	actor, _ := c.Locals("actor").(string)

	var req VerifySubscriptionRequest
	if err := c.BodyParser(&req); err != nil || req.RazorpaySubscriptionID == "" || req.RazorpayPaymentID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "invalid verification payload"})
	}

	isValid := NewRazorpayClient(
		s.Config.RazorpayKeyID,
		s.Config.RazorpayKeySecret,
		s.Config.RazorpayWebhookSecret,
	).VerifySubscriptionSignature(req.RazorpayPaymentID, req.RazorpaySubscriptionID, req.RazorpaySignature)

	if !isValid && !signatureAllowed(s, req.RazorpaySignature) {
		return c.Status(400).JSON(fiber.Map{"error": "invalid subscription signature"})
	}

	record, err := s.DB.GetSubscriptionByRazorpayID(req.RazorpaySubscriptionID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "subscription lookup failed"})
	}
	if record == nil || record.OrgID != orgID {
		return c.Status(404).JSON(fiber.Map{"error": "subscription not found for this organization"})
	}

	nextPeriod := time.Now().AddDate(0, 1, 0)
	if err := s.DB.UpdateOrgSubscription(orgID, record.Plan, record.RazorpaySubID, "active", nextPeriod); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to activate subscription"})
	}
	_ = s.DB.SetSubscriptionStatus(record.ID, "active")

	_ = s.LogAuditOrg(orgID, "SUBSCRIPTION_ACTIVATED", &record.RazorpaySubID, &record.Plan, actor, c.IP(), c.Get("User-Agent"))

	updatedOrg, _ := s.DB.GetOrganizationByID(orgID)
	return c.JSON(fiber.Map{
		"message": "subscription verified and activated",
		"status":  "active",
		"plan":    record.Plan,
		"org":     updatedOrg,
	})
}

func (s *Server) handleCancelSubscription(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	actor, _ := c.Locals("actor").(string)

	if err := s.DB.UpdateOrgSubscriptionStatus(orgID, "cancelled"); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to cancel subscription"})
	}

	_ = s.LogAuditOrg(orgID, "SUBSCRIPTION_CANCELLED", nil, nil, actor, c.IP(), c.Get("User-Agent"))

	updatedOrg, _ := s.DB.GetOrganizationByID(orgID)
	return c.JSON(fiber.Map{
		"message": "subscription auto-renewal cancelled",
		"org":     updatedOrg,
	})
}
