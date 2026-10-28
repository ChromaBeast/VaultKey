package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// Plans are sold only as Razorpay subscriptions (see subscriptions_handler.go).
// One-time orders were removed: they set a paid plan with no period end, which
// the expiry sweep never downgrades.

func sha256Hex(b []byte) string {
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:])
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
	return c.JSON(fiber.Map{"enabled": s.Config.BillingEnabled(), "key_id": s.Config.RazorpayKeyID})
}

func (s *Server) handleListPayments(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	payments, err := s.DB.ListPaymentsByOrg(orgID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to retrieve payment history"})
	}
	return c.JSON(payments)
}
