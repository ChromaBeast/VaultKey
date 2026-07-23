package api

import (
	"crypto/rand"
	"encoding/hex"
	"time"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

type CreateShareReq struct {
	Secret   string `json:"secret"`
	MaxViews int    `json:"max_views"`
	Duration string `json:"duration"` // 1h, 24h, 7d
}

func (s *Server) handleCreateShare(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	var req CreateShareReq
	if err := c.BodyParser(&req); err != nil || req.Secret == "" {
		return c.Status(400).JSON(fiber.Map{"error": "secret is required"})
	}

	if req.MaxViews <= 0 {
		req.MaxViews = 1
	}

	ttl := 24 * time.Hour
	switch req.Duration {
	case "1h":
		ttl = 1 * time.Hour
	case "7d":
		ttl = 7 * 24 * time.Hour
	}

	idBytes := make([]byte, 16)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate share ID"})
	}
	id := "sh_" + hex.EncodeToString(idBytes)

	share := db.SharedSecret{
		ID:         id,
		OrgID:      orgID,
		Ciphertext: req.Secret,
		MaxViews:   req.MaxViews,
		ExpiresAt:  time.Now().Add(ttl),
	}

	if err := s.DB.CreateSharedSecret(share); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create share link"})
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "CREATE_SHARE", nil, nil, actor, c.IP(), c.Get("User-Agent"))

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

	return c.JSON(fiber.Map{
		"secret":     share.Ciphertext,
		"view_count": share.ViewCount,
		"max_views":  share.MaxViews,
		"expires_at": share.ExpiresAt,
	})
}
