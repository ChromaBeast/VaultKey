package api

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"time"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

type CreateShareReq struct {
	Secret   string `json:"secret"`
	MaxViews int    `json:"max_views"`
	Duration string `json:"duration"`
}

func shareTTL(duration string) (time.Duration, bool) {
	switch duration {
	case "1h":
		return 1 * time.Hour, true
	case "24h", "":
		return 24 * time.Hour, true
	case "7d":
		return 7 * 24 * time.Hour, true
	default:
		return 0, false
	}
}

func (s *Server) handleCreateShare(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	actor := c.Locals("actor").(string)
	p, _ := c.Locals("permissions").(string)

	if p != "admin" && p != "write" && p != "read" {
		return c.Status(403).JSON(fiber.Map{"error": "insufficient permissions to create share links"})
	}

	var req CreateShareReq
	if err := c.BodyParser(&req); err != nil || req.Secret == "" {
		return c.Status(400).JSON(fiber.Map{"error": "secret is required"})
	}
	if len(req.Secret) > 64*1024 {
		return c.Status(400).JSON(fiber.Map{"error": "secret payload too large"})
	}

	if req.MaxViews <= 0 {
		req.MaxViews = 1
	}
	if req.MaxViews > 100 {
		req.MaxViews = 100
	}

	ttl, ok := shareTTL(req.Duration)
	if !ok {
		return c.Status(400).JSON(fiber.Map{"error": "duration must be one of: 1h, 24h, 7d"})
	}

	ciphertext, err := crypto.Encrypt(orgID, req.Secret)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to encrypt share payload"})
	}

	idBytes := make([]byte, 16)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate share ID"})
	}
	id := "sh_" + hex.EncodeToString(idBytes)

	share := db.SharedSecret{
		ID:         id,
		OrgID:      orgID,
		Ciphertext: base64.StdEncoding.EncodeToString(ciphertext),
		MaxViews:   req.MaxViews,
		ExpiresAt:  time.Now().Add(ttl),
	}

	if err := s.DB.CreateSharedSecret(share); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create share link"})
	}

	_ = s.LogAuditOrg(orgID, "CREATE_SHARE", &id, nil, actor, c.IP(), c.Get("User-Agent"))

	return c.Status(201).JSON(fiber.Map{
		"id":         id,
		"share_url":  "/share/" + id,
		"max_views":  share.MaxViews,
		"expires_at": share.ExpiresAt,
	})
}

func (s *Server) handleGetShare(c *fiber.Ctx) error {
	id := c.Params("id")
	share, err := s.DB.GetAndIncrementSharedSecret(id)
	if err != nil || share == nil {
		return c.Status(404).JSON(fiber.Map{"error": "shared secret is invalid, expired, or self-destructed"})
	}

	raw, err := base64.StdEncoding.DecodeString(share.Ciphertext)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "shared secret is invalid, expired, or self-destructed"})
	}

	plain, err := crypto.Decrypt(share.OrgID, raw)
	if err != nil {
		return c.Status(423).JSON(fiber.Map{
			"error": "the vault is locked right now; the owner must unlock it before this secret can be revealed",
			"code":  "VAULT_LOCKED",
		})
	}

	_ = s.LogAuditOrg(share.OrgID, "SHARE_VIEWED", &id, nil, "public:"+c.IP(), c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"secret":     plain,
		"view_count": share.ViewCount,
		"max_views":  share.MaxViews,
		"expires_at": share.ExpiresAt,
	})
}
