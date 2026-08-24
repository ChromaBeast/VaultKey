package api

import (
	"strconv"
	"vaultkey/internal/crypto"

	"github.com/gofiber/fiber/v2"
)

func queryInt(c *fiber.Ctx, name string) (int, error) {
	v := c.Query(name)
	if v == "" {
		return 0, nil
	}
	return strconv.Atoi(v)
}

func clampLimit(c *fiber.Ctx) (int, int) {
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	if limit < 1 {
		limit = 1
	}
	if limit > 500 {
		limit = 500
	}
	offset, _ := strconv.Atoi(c.Query("offset", "0"))
	if offset < 0 {
		offset = 0
	}
	return limit, offset
}

func (s *Server) handleListAudit(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	p := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}

	limit, offset := clampLimit(c)
	list, err := s.DB.ListAuditEntries(orgID, limit, offset, c.Query("action"), c.Query("project"))
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
			"prev_hmac":  e.PrevHMAC,
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

	signingKey := []byte(s.Config.AuditSigningKey)
	prev := ""
	valid := true
	var brokenAt int

	for i, e := range entries {
		fields := crypto.EntryFields{
			ID:         e.ID,
			Action:     e.Action,
			SecretKey:  e.SecretKey,
			Project:    e.Project,
			Actor:      e.Actor,
			Timestamp:  e.CreatedAt.UTC().Format("2006-01-02T15:04:05Z"),
			SignedAt:   deref(e.SignedAt),
			PrevHMAC:   prev,
			HMAC:       e.HMAC,
			SigVersion: e.SigVersion,
		}
		if fields.SigVersion >= 2 && e.PrevHMAC != nil && *e.PrevHMAC != prev {
			valid = false
			brokenAt = i
			break
		}
		if !crypto.VerifyEntryHMAC(fields, signingKey) {
			valid = false
			brokenAt = i
			break
		}
		prev = e.HMAC
	}

	body := fiber.Map{
		"verified": valid,
		"count":    len(entries),
	}
	if !valid {
		body["broken_at_index"] = brokenAt
	}
	return c.JSON(body)
}

func deref(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
