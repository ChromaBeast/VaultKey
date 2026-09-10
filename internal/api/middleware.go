package api

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"strings"
	"time"
	"vaultkey/internal/crypto"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

var validPermissions = map[string]bool{
	"admin": true, "write": true, "read": true, "list": true,
}

func normalizeBearer(header string) string {
	h := strings.TrimSpace(header)
	if len(h) >= 7 && strings.EqualFold(h[:7], "bearer ") {
		return strings.TrimSpace(h[7:])
	}
	return ""
}

func (s *Server) AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		raw := normalizeBearer(c.Get("Authorization"))
		if raw == "" {
			return c.Status(401).JSON(fiber.Map{"error": "missing api key"})
		}

		parts := strings.Split(raw, ".")
		if len(parts) != 2 {
			return c.Status(401).JSON(fiber.Map{"error": "invalid api key format"})
		}
		id := parts[0]

		apiKey, err := s.DB.FindAPIKeyByID(id)
		if err != nil || apiKey == nil || !apiKey.Active {
			return c.Status(401).JSON(fiber.Map{"error": "invalid api key"})
		}

		if apiKey.ExpiresAt != nil && apiKey.ExpiresAt.Before(time.Now()) {
			return c.Status(401).JSON(fiber.Map{"error": "api key has expired"})
		}

		if strings.HasPrefix(apiKey.KeyHash, "$2") {
			if err := bcrypt.CompareHashAndPassword([]byte(apiKey.KeyHash), []byte(raw)); err != nil {
				return c.Status(401).JSON(fiber.Map{"error": "invalid api key"})
			}
		} else {
			h := sha256.Sum256([]byte(raw))
			expected := hex.EncodeToString(h[:])
			if subtle.ConstantTimeCompare([]byte(apiKey.KeyHash), []byte(expected)) != 1 {
				return c.Status(401).JSON(fiber.Map{"error": "invalid api key"})
			}
		}

		path := c.Path()
		if path != "/v1/vault/status" && path != "/v1/vault/lock" && crypto.Global.IsLocked(apiKey.OrgID) {
			return c.Status(423).JSON(fiber.Map{
				"error":  "organization vault is locked",
				"code":   "VAULT_LOCKED",
				"org_id": apiKey.OrgID,
			})
		}

		if apiKey.LastUsed == nil || time.Since(*apiKey.LastUsed) > time.Minute {
			_ = s.DB.UpdateKeyLastUsed(apiKey.ID)
		}

		s.RecordActivity(apiKey.OrgID)

		c.Locals("org_id", apiKey.OrgID)
		c.Locals("actor", apiKey.ID)
		c.Locals("permissions", apiKey.Permissions)
		c.Locals("scope_project", apiKey.Project)

		return c.Next()
	}
}

func (s *Server) SecurityHeadersMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("X-Frame-Options", "DENY")
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Set("Content-Security-Policy", "default-src 'self'; script-src 'self' https://checkout.razorpay.com https://challenges.cloudflare.com; frame-src https://api.razorpay.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com; font-src 'self' data: https://cdn.fontshare.com https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com;")
		return c.Next()
	}
}
