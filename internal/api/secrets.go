package api

import (
	"crypto/rand"
	"encoding/hex"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

type SecretReq struct {
	Key         string `json:"key"`
	Value       string `json:"value"`
	Project     string `json:"project"`
	Environment string `json:"environment"`
}

func (s *Server) checkAuth(c *fiber.Ctx, reqPerm, project string) bool {
	p, _ := c.Locals("permissions").(string)
	sp, _ := c.Locals("scope_project").(*string)

	if sp != nil && *sp != project {
		return false
	}

	if p == "admin" {
		return true
	}
	switch reqPerm {
	case "list":
		return p == "list" || p == "read" || p == "write"
	case "read":
		return p == "read" || p == "write"
	case "write":
		return p == "write"
	}
	return false
}

func (s *Server) handleCreateSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	var req SecretReq
	if err := c.BodyParser(&req); err != nil || req.Key == "" || req.Value == "" {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.Project == "" {
		req.Project = "default"
	}
	if req.Environment == "" {
		req.Environment = "production"
	}

	if !s.checkAuth(c, "write", req.Project) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized project or permission"})
	}

	org, err := s.DB.GetOrganizationByID(orgID)
	if err == nil && org != nil && org.Plan == "free" {
		count, _ := s.DB.CountSecrets(orgID)
		if count >= 25 {
			return c.Status(402).JSON(fiber.Map{
				"error": "free plan limit reached (max 25 secrets). Upgrade to Pro for unlimited secrets.",
				"code":  "TIER_LIMIT_REACHED",
			})
		}
	}

	encVal, err := crypto.Encrypt(orgID, req.Value)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "encryption failed"})
	}

	idBytes := make([]byte, 16)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate secret ID"})
	}
	id := hex.EncodeToString(idBytes)

	actor := c.Locals("actor").(string)
	err = s.DB.CreateSecret(db.Secret{
		ID:          id,
		OrgID:       orgID,
		Key:         req.Key,
		Value:       encVal,
		Project:     req.Project,
		Environment: req.Environment,
		CreatedBy:   actor,
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed: " + err.Error()})
	}

	_ = s.LogAuditOrg(orgID, "WRITE", &req.Key, &req.Project, actor, c.IP(), c.Get("User-Agent"))
	return c.Status(201).JSON(fiber.Map{"id": id, "key": req.Key})
}

func (s *Server) handleListSecrets(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	proj := c.Query("project", "default")
	env := c.Query("environment", "production")

	if !s.checkAuth(c, "list", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	list, err := s.DB.ListSecrets(orgID, proj, env)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}

	res := make([]fiber.Map, len(list))
	for i, item := range list {
		res[i] = fiber.Map{
			"id":         item.ID,
			"key":        item.Key,
			"project":    item.Project,
			"env":        item.Environment,
			"version":    item.Version,
			"created_by": item.CreatedBy,
			"updated_at": item.UpdatedAt,
		}
	}
	return c.JSON(res)
}

func (s *Server) handleGetSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	key := c.Params("key")
	proj := c.Query("project", "default")
	env := c.Query("environment", "production")

	if !s.checkAuth(c, "read", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	sec, err := s.DB.GetSecret(orgID, proj, env, key)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database error"})
	}
	if sec == nil {
		return c.Status(404).JSON(fiber.Map{"error": "secret not found"})
	}

	plain, err := crypto.Decrypt(orgID, sec.Value)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "decryption failed"})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "READ", &key, &proj, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"key":     sec.Key,
		"value":   plain,
		"version": sec.Version,
	})
}

func (s *Server) handleBatchGetSecrets(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	proj := c.Query("project", "default")
	env := c.Query("environment", "production")

	if !s.checkAuth(c, "read", proj) {
		return c.Status(403).JSON(fiber.Map{"error": "unauthorized"})
	}

	list, err := s.DB.ListSecretsWithValues(orgID, proj, env)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}

	res := make(map[string]string)
	for _, item := range list {
		plain, err := crypto.Decrypt(orgID, item.Value)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "decryption failed for key: " + item.Key})
		}
		res[item.Key] = plain
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "BATCH_READ", nil, &proj, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(res)
}
