package api

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

var dbErrVersionConflict = db.ErrVersionConflict

type UpdateSecretReq struct {
	Value       string `json:"value"`
	Project     string `json:"project"`
	Environment string `json:"environment"`
}

func (s *Server) handleUpdateSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	key := c.Params("key")

	var req UpdateSecretReq
	if err := c.BodyParser(&req); err != nil || req.Value == "" {
		return c.Status(400).JSON(fiber.Map{"error": "value is required"})
	}
	if len(req.Value) > 64*1024 {
		return c.Status(400).JSON(fiber.Map{"error": "secret value too large (max 64KiB)"})
	}

	proj := c.Query("project")
	if proj == "" {
		proj = req.Project
	}
	if proj == "" {
		proj = "default"
	}

	env := c.Query("environment")
	if env == "" {
		env = req.Environment
	}
	if env == "" {
		env = "production"
	}

	if !s.checkAuth(c, "write", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
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
		if errors.Is(err, dbErrVersionConflict) {
			return c.Status(409).JSON(fiber.Map{"error": "secret was modified concurrently; retry with the current version"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "failed to update secret"})
	}

	actor := c.Locals("actor").(string)
	if err := s.LogAuditOrg(orgID, "WRITE", &key, &proj, actor, c.IP(), c.Get("User-Agent")); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "audit log write failed; secret update aborted"})
	}

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

	res := make([]fiber.Map, 0, len(versions))
	for _, v := range versions {
		plain, err := crypto.Decrypt(orgID, v.Value)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to decrypt version history; possible key rotation corruption"})
		}
		res = append(res, fiber.Map{
			"id":         v.ID,
			"version":    v.Version,
			"value":      plain,
			"created_at": v.CreatedAt,
		})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "VERSIONS_READ", &key, &proj, actor, c.IP(), c.Get("User-Agent"))

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
