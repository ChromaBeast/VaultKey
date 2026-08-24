package api

import (
	"vaultkey/internal/crypto"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) handleLock(c *fiber.Ctx) error {
	orgID, ok := c.Locals("org_id").(string)
	if !ok || orgID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "org_id context missing"})
	}

	p, _ := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required to lock the vault"})
	}

	if crypto.Global.IsLocked(orgID) {
		return c.JSON(fiber.Map{"status": "already locked"})
	}

	crypto.Global.Lock(orgID)
	actor, _ := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "LOCK", nil, nil, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{"status": "locked"})
}

func (s *Server) handleStatus(c *fiber.Ctx) error {
	orgID, _ := c.Locals("org_id").(string)
	if orgID == "" {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	return c.JSON(fiber.Map{
		"org_id":  orgID,
		"locked":  crypto.Global.IsLocked(orgID),
		"version": "2.1.0",
	})
}
