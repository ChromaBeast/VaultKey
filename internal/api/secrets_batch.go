package api

import (
	"strings"
	"vaultkey/internal/crypto"

	"github.com/gofiber/fiber/v2"
)

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

	res := make(map[string]string, len(list))
	keys := make([]string, 0, len(list))
	for _, item := range list {
		plain, err := crypto.Decrypt(orgID, item.Value)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "decryption failed for key: " + item.Key})
		}
		res[item.Key] = plain
		keys = append(keys, item.Key)
	}

	var keySummary *string
	if len(keys) > 0 {
		joined := strings.Join(keys, ",")
		keySummary = &joined
	}

	actor := c.Locals("actor").(string)
	_ = s.LogAuditOrg(orgID, "BATCH_READ", keySummary, &proj, actor, c.IP(), c.Get("User-Agent"))

	return c.JSON(res)
}
