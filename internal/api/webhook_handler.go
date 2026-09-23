package api

import (
	"encoding/json"
	"log"
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
	if s.Config.RazorpayWebhookSecret == "" && !s.Config.IsDev() {
		return c.Status(503).JSON(fiber.Map{"error": "billing webhook is not configured"})
	}
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
	if jsonErr := json.Unmarshal(body, &event); jsonErr != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid webhook payload"})
	}

	first, err := s.DB.RecordWebhookEvent(eventID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "webhook processing failed"})
	}
	if !first {
		return c.JSON(fiber.Map{"status": "duplicate ignored"})
	}

	if err := s.processWebhookEvent(&event); err != nil {
		if cleanupErr := s.DB.DeleteWebhookEvent(eventID); cleanupErr != nil {
			log.Printf("failed to release webhook event %s after processing error: %v", eventID, cleanupErr)
		}
		return c.Status(500).JSON(fiber.Map{"error": "webhook processing failed"})
	}
	return c.JSON(fiber.Map{"status": "ok"})
}

func fmtEventFallback(body []byte) string {
	sum := sha256Hex(body)
	return sum
}

func (s *Server) processWebhookEvent(e *webhookEvent) error {
	now := time.Now()
	switch e.Event {
	case "subscription.charged":
		sub := e.Payload.Subscription.Entity
		record, err := s.DB.GetSubscriptionByRazorpayID(sub.ID)
		if err != nil {
			return err
		}
		if record == nil {
			return nil
		}
		periodEnd := now.AddDate(0, 1, 0)
		if sub.CurrentEnd > 0 {
			periodEnd = time.Unix(sub.CurrentEnd, 0)
		}
		if err := s.DB.UpdateOrgSubscription(record.OrgID, record.Plan, sub.ID, "active", periodEnd); err != nil {
			return err
		}
		return s.DB.SetSubscriptionStatus(record.ID, "active")
	case "subscription.cancelled", "subscription.completed", "subscription.halted":
		sub := e.Payload.Subscription.Entity
		record, err := s.DB.GetSubscriptionByRazorpayID(sub.ID)
		if err != nil {
			return err
		}
		if record == nil {
			return nil
		}

		// Cancellation and completion stop renewal; they do not revoke the
		// already-paid period. The periodic expiry sweep downgrades after its end.
		orgStatus := "cancelled"
		recordStatus := "cancelled"
		if e.Event == "subscription.halted" {
			orgStatus = "past_due"
			recordStatus = "halted"
		} else if e.Event == "subscription.completed" {
			recordStatus = "completed"
		}
		if sub.CurrentEnd > 0 {
			if err := s.DB.UpdateOrgSubscription(record.OrgID, record.Plan, sub.ID, orgStatus, time.Unix(sub.CurrentEnd, 0)); err != nil {
				return err
			}
		} else if err := s.DB.UpdateOrgSubscriptionStatus(record.OrgID, orgStatus); err != nil {
			return err
		}
		return s.DB.SetSubscriptionStatus(record.ID, recordStatus)
	case "payment.failed":
		pay := e.Payload.Payment.Entity
		if pay.OrderID != "" {
			p, err := s.DB.GetPaymentByOrderID(pay.OrderID)
			if err != nil {
				return err
			}
			if p != nil {
				return s.DB.UpdatePaymentStatus(pay.OrderID, pay.ID, "", "failed")
			}
		}
	}
	return nil
}
