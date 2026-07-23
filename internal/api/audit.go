package api

import (
	"strconv"
	"time"
	"vaultkey/internal/crypto"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) handleListAudit(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	p := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}

	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	offset, _ := strconv.Atoi(c.Query("offset", "0"))

	list, err := s.DB.ListAuditEntries(orgID, limit, offset)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}

	res := make([]fiber.Map, len(list))
	for i, e := range list {
		res[i] = fiber.Map{
			"id":         e.ID,
			"action":     e.Action,
			"secret_key": e.SecretKey,
			"project":    e.Project,
			"actor":      e.Actor,
			"ip_address": e.IPAddress,
			"user_agent": e.UserAgent,
			"hmac":       e.HMAC,
			"created_at": e.CreatedAt,
		}
	}
	return c.JSON(res)
}

func (s *Server) handleVerifyAudit(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	p := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}

	entries, err := s.DB.GetAllAuditEntries(orgID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}

	prev := ""
	signingKey := []byte(s.Config.AuditSigningKey)
	valid := true

	for _, e := range entries {
		timestamp := e.CreatedAt.UTC().Format(time.RFC3339)
		expected := crypto.SignEntry(e.ID, e.Action, e.SecretKey, e.Project, e.Actor, timestamp, prev, signingKey)
		if e.HMAC != expected {
			valid = false
			break
		}
		prev = e.HMAC
	}

	return c.JSON(fiber.Map{
		"verified": valid,
		"count":    len(entries),
	})
}
