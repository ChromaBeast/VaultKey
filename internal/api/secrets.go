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

func isValidName(s string, maxLen int) bool {
	if s == "" || len(s) > maxLen {
		return false
	}
	for i := 0; i < len(s); i++ {
		ch := s[i]
		ok := ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9' || ch == '_' || ch == '-' || ch == '.'
		if !ok {
			return false
		}
	}
	return true
}

func (s *Server) handleCreateSecret(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	var req SecretReq
	if err := c.BodyParser(&req); err != nil || req.Key == "" || req.Value == "" {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}
	if !isValidName(req.Key, 256) {
		return c.Status(400).JSON(fiber.Map{"error": "key must be 1-256 chars of [A-Za-z0-9_.-]"})
	}
	if len(req.Value) > 64*1024 {
		return c.Status(400).JSON(fiber.Map{"error": "secret value too large (max 64KiB)"})
	}
	if req.Project == "" {
		req.Project = "default"
	}
	if req.Environment == "" {
		req.Environment = "production"
	}
	if !isValidName(req.Project, 64) || !isValidName(req.Environment, 64) {
		return c.Status(400).JSON(fiber.Map{"error": "project/environment must be 1-64 chars of [A-Za-z0-9_.-]"})
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
		return c.Status(500).JSON(fiber.Map{"error": "failed to store secret"})
	}

	if auditErr := s.LogAuditOrg(orgID, "WRITE", &req.Key, &req.Project, actor, c.IP(), c.Get("User-Agent")); auditErr != nil {
		_ = s.DB.DeleteSecret(orgID, id)
		return c.Status(500).JSON(fiber.Map{"error": "audit log write failed; secret not stored"})
	}
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
