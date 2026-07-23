package api

import (
	"crypto/rand"
	"encoding/hex"
	"vaultkey/internal/crypto"

	"github.com/gofiber/fiber/v2"
)

type UpdateSecretReq struct {
	Value string `json:"value"`
}

func (s *Server) handleUpdateSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	key := c.Params("key")
	proj := c.Query("project", "default")
	env := c.Query("environment", "production")

	if !s.checkAuth(c, "write", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	var req UpdateSecretReq
	if err := c.BodyParser(&req); err != nil || req.Value == "" {
		return c.Status(400).JSON(fiber.Map{"error": "value is required"})
	}

	oldSec, err := s.DB.GetSecret(orgID, proj, env, key)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}
	if oldSec == nil {
		return c.Status(404).JSON(fiber.Map{"error": "secret not found"})
	}

	newEncVal, err := crypto.Encrypt(orgID, req.Value)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "encryption failed"})
	}

	archiveIDBytes := make([]byte, 16)
	if _, err := rand.Read(archiveIDBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate archive ID"})
	}
	archiveID := hex.EncodeToString(archiveIDBytes)

	newSec := *oldSec
	newSec.Value = newEncVal
	newSec.Version = oldSec.Version + 1

	if err := s.DB.UpdateSecret(newSec, *oldSec, archiveID); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update secret"})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "WRITE", &key, &proj, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{"status": "updated", "version": newSec.Version})
}

func (s *Server) handleDeleteSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	key := c.Params("key")
	proj := c.Query("project", "default")
	env := c.Query("environment", "production")

	if !s.checkAuth(c, "write", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	sec, err := s.DB.GetSecret(orgID, proj, env, key)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}
	if sec == nil {
		return c.Status(404).JSON(fiber.Map{"error": "secret not found"})
	}

	if err := s.DB.DeleteSecret(orgID, sec.ID); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to delete secret"})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "DELETE", &key, &proj, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{"status": "deleted"})
}

func (s *Server) handleGetSecretVersions(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	key := c.Params("key")
	proj := c.Query("project", "default")
	env := c.Query("environment", "production")

	if !s.checkAuth(c, "read", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	sec, err := s.DB.GetSecret(orgID, proj, env, key)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}
	if sec == nil {
		return c.Status(404).JSON(fiber.Map{"error": "secret not found"})
	}

	versions, err := s.DB.GetSecretVersions(sec.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to retrieve versions"})
	}

	res := make([]fiber.Map, len(versions))
	for i, v := range versions {
		plain, _ := crypto.Decrypt(orgID, v.Value)
		res[i] = fiber.Map{
			"version":    v.Version,
			"value":      plain,
			"created_at": v.CreatedAt,
		}
	}

	return c.JSON(res)
}

func (s *Server) handleListProjects(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	projects, err := s.DB.ListProjects(orgID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to list projects"})
	}
	return c.JSON(projects)
}
