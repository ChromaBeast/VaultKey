package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"time"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

type CreateAPIKeyReq struct {
	Name        string  `json:"name"`
	Permissions string  `json:"permissions"`
	Project     *string `json:"project"`
	ExpiresAt   *string `json:"expires_at"`
}

func (s *Server) handleCreateAPIKey(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	p := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}

	var req CreateAPIKeyReq
	if err := c.BodyParser(&req); err != nil || req.Name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "name is required"})
	}

	org, err := s.DB.GetOrganizationByID(orgID)
	if err == nil && org != nil && org.Plan == "free" {
		count, _ := s.DB.CountAPIKeys(orgID)
		if count >= 2 {
			return c.Status(402).JSON(fiber.Map{
				"error": "free plan limit reached (max 2 API keys). Upgrade to Pro for unlimited keys.",
				"code":  "TIER_LIMIT_REACHED",
			})
		}
	}

	if req.Permissions == "" {
		req.Permissions = "read"
	}

	idBytes := make([]byte, 8)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate key ID"})
	}
	id := "vk_" + hex.EncodeToString(idBytes)

	secretBytes := make([]byte, 24)
	if _, err := rand.Read(secretBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate key secret"})
	}
	secret := hex.EncodeToString(secretBytes)

	rawToken := id + "." + secret

	h := sha256.Sum256([]byte(rawToken))
	hashed := hex.EncodeToString(h[:])

	var expTime *time.Time
	if req.ExpiresAt != nil && *req.ExpiresAt != "" {
		parsed, err := time.Parse(time.RFC3339, *req.ExpiresAt)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid expires_at format"})
		}
		expTime = &parsed
	}

	var proj *string = req.Project
	if proj != nil && *proj == "" {
		proj = nil
	}

	err = s.DB.CreateAPIKey(db.APIKey{
		ID:          id,
		OrgID:       orgID,
		Name:        req.Name,
		KeyHash:     string(hashed),
		Permissions: req.Permissions,
		Project:     proj,
		ExpiresAt:   expTime,
		Active:      true,
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "CREATE_KEY", nil, nil, actor, c.IP(), c.Get("User-Agent"))

	return c.Status(201).JSON(fiber.Map{
		"id":          id,
		"name":        req.Name,
		"token":       rawToken,
		"permissions": req.Permissions,
		"project":     req.Project,
		"expires_at":  req.ExpiresAt,
	})
}

func (s *Server) handleListAPIKeys(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	p := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}

	keys, err := s.DB.ListAPIKeys(orgID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "database failed"})
	}

	res := make([]fiber.Map, len(keys))
	for i, k := range keys {
		res[i] = fiber.Map{
			"id":          k.ID,
			"name":        k.Name,
			"permissions": k.Permissions,
			"project":     k.Project,
			"last_used":   k.LastUsed,
			"expires_at":  k.ExpiresAt,
			"created_at":  k.CreatedAt,
			"active":      k.Active,
		}
	}
	return c.JSON(res)
}

func (s *Server) handleRevokeAPIKey(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	p := c.Locals("permissions").(string)
	if p != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}

	id := c.Params("id")
	if err := s.DB.RevokeAPIKey(orgID, id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to revoke key"})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "REVOKE_KEY", nil, nil, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{"status": "revoked"})
}
