package api

import (
	"crypto/rand"
	"encoding/hex"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func (s *Server) handleRollbackSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	actor, _ := c.Locals("actor").(string)
	key := c.Params("key")
	if key == "" {
		return c.Status(400).JSON(fiber.Map{"error": "secret key required"})
	}

	project := strings.TrimSpace(c.Query("project", "default"))
	if project == "" {
		project = "default"
	}
	env := strings.TrimSpace(c.Query("environment"))
	if env == "" {
		env = "production"
	}
	version, err := queryInt(c, "version")
	if err != nil || version <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "valid target version required"})
	}

	if !s.checkAuth(c, "write", project) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	secret, err := s.DB.GetSecret(orgID, project, env, key)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}
	if secret == nil {
		return c.Status(404).JSON(fiber.Map{"error": "secret not found"})
	}

	versionVal, err := s.DB.GetSecretVersionValue(orgID, secret.ID, version)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to load target version"})
	}
	if len(versionVal) == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "target version payload not found"})
	}

	updatedSecret := *secret
	updatedSecret.Value = versionVal
	updatedSecret.Version = secret.Version + 1

	archiveIDBytes := make([]byte, 16)
	if _, err := rand.Read(archiveIDBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate archive ID"})
	}

	if err := s.DB.UpdateSecret(updatedSecret, *secret, hex.EncodeToString(archiveIDBytes)); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to rollback secret version"})
	}

	_ = s.LogAuditOrg(orgID, "SECRET_ROLLBACK", &key, &project, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"message":     "secret successfully rolled back",
		"key":         key,
		"environment": env,
		"version":     updatedSecret.Version,
	})
}
