package api

import (
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
)

type webhookEvent struct {
	Event   string `json:"event"`
	Payload struct {
		Subscription struct {
			Entity struct {
				ID         string `json:"id"`
				Status     string `json:"status"`
				CurrentEnd int64  `json:"current_end"`
			} `json:"entity"`
		} `json:"subscription"`
		Payment struct {
			Entity struct {
				ID      string `json:"id"`
				Status  string `json:"status"`
				OrderID string `json:"order_id"`
			} `json:"entity"`
		} `json:"payment"`
	} `json:"payload"`
}

func (s *Server) handleRazorpayWebhook(c *fiber.Ctx) error {
	signature := c.Get("X-Razorpay-Signature")
	body := c.Body()

	if signature == "" {
		if !s.Config.IsDev() {
			return c.Status(400).JSON(fiber.Map{"error": "missing webhook signature"})
		}
	} else if !NewRazorpayClient(
		s.Config.RazorpayKeyID,
		s.Config.RazorpayKeySecret,
		s.Config.RazorpayWebhookSecret,
	).VerifyWebhookSignature(body, signature) {
		return c.Status(400).JSON(fiber.Map{"error": "invalid webhook signature"})
	}

	var event webhookEvent
	eventID := c.Get("X-Razorpay-Event-Id")
	if eventID == "" {
		eventID = fmtEventFallback(body)
	}
	first, err := s.DB.RecordWebhookEvent(eventID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "webhook processing failed"})
	}
	if !first {
		return c.JSON(fiber.Map{"status": "duplicate ignored"})
	}

	if jsonErr := json.Unmarshal(body, &event); jsonErr != nil {
		return c.JSON(fiber.Map{"status": "ignored unparseable payload"})
	}

	s.processWebhookEvent(&event)
	return c.JSON(fiber.Map{"status": "ok"})
}

func fmtEventFallback(body []byte) string {
	sum := sha256Hex(body)
	return sum
}

func (s *Server) processWebhookEvent(e *webhookEvent) {
	now := time.Now()
	switch e.Event {
	case "subscription.charged":
		sub := e.Payload.Subscription.Entity
		record, err := s.DB.GetSubscriptionByRazorpayID(sub.ID)
		if err != nil || record == nil {
			return
		}
		periodEnd := now.AddDate(0, 1, 0)
		if sub.CurrentEnd > 0 {
			periodEnd = time.Unix(sub.CurrentEnd, 0)
		}
		_ = s.DB.UpdateOrgSubscription(record.OrgID, record.Plan, sub.ID, "active", periodEnd)
		_ = s.DB.SetSubscriptionStatus(record.ID, "active")
	case "subscription.cancelled", "subscription.completed", "subscription.halted":
		sub := e.Payload.Subscription.Entity
		record, err := s.DB.GetSubscriptionByRazorpayID(sub.ID)
		if err != nil || record == nil {
			return
		}
		_ = s.DB.UpdateOrgSubscriptionStatus(record.OrgID, "cancelled")
		_ = s.DB.SetSubscriptionStatus(record.ID, sub.Status)
		_ = s.DB.UpdateOrganizationPlan(record.OrgID, "free")
	case "payment.failed":
		pay := e.Payload.Payment.Entity
		if pay.OrderID != "" {
			if p, err := s.DB.GetPaymentByOrderID(pay.OrderID); err == nil && p != nil {
				_ = s.DB.UpdatePaymentStatus(pay.OrderID, pay.ID, "", "failed")
			}
		}
	}
}
