package api

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type RollbackRequest struct {
	Project string `json:"project"`
	Version int    `json:"version"`
}

func (s *Server) handleRollbackSecret(c *fiber.Ctx) error {
	orgID, ok := c.Locals("org_id").(string)
	if !ok || orgID == "" {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}
	actor, _ := c.Locals("actor").(string)
	key := c.Params("key")
	if key == "" {
		return c.Status(400).JSON(fiber.Map{"error": "secret key required"})
	}

	var req RollbackRequest
	if err := c.BodyParser(&req); err != nil || req.Version <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "valid target version required"})
	}

	project := strings.TrimSpace(req.Project)
	if project == "" {
		project = "default"
	}

	secret, err := s.DB.GetSecret(orgID, project, "production", key)
	if err != nil || secret == nil {
		return c.Status(404).JSON(fiber.Map{"error": "secret not found"})
	}

	versionVal, err := s.DB.GetSecretVersionValue(orgID, secret.ID, req.Version)
	if err != nil || len(versionVal) == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "target version payload not found"})
	}

	updatedSecret := *secret
	updatedSecret.Value = versionVal
	updatedSecret.Version = secret.Version + 1

	versionID := "ver_" + uuid.New().String()[:8]
	if err := s.DB.UpdateSecret(updatedSecret, *secret, versionID); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to rollback secret version"})
	}

	_ = s.LogAuditOrg(orgID, "SECRET_ROLLBACK", &key, &project, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"message": "secret successfully rolled back",
		"key":     key,
		"version": updatedSecret.Version,
	})
}
