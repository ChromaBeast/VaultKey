package api

import (
	"encoding/hex"
	"strings"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func cryptoGetKey(orgID string) ([]byte, error) {
	return crypto.Global.Get(orgID)
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

func (s *Server) handleChangePassword(c *fiber.Ctx) error {
	orgID := c.Locals("org_id").(string)
	actor, _ := c.Locals("actor").(string)

	var req ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil || req.CurrentPassword == "" || req.NewPassword == "" {
		return c.Status(400).JSON(fiber.Map{"error": "current_password and new_password are required"})
	}
	if len(req.NewPassword) < 8 {
		return c.Status(400).JSON(fiber.Map{"error": "password must be at least 8 characters"})
	}

	user, err := s.findSessionUser(actor)
	if err != nil || user == nil || user.OrgID != orgID {
		return c.Status(403).JSON(fiber.Map{"error": "password change requires a session token from a logged-in user"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid current password"})
	}

	key, err := cryptoGetKey(orgID)
	if err != nil {
		return c.Status(423).JSON(fiber.Map{"error": "vault is locked", "code": "VAULT_LOCKED"})
	}
	defer crypto.Zero(key)

	newWrap, err := crypto.WrapMasterKey(key, req.NewPassword)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to re-wrap vault key"})
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
	}

	if err := s.DB.UpdateUserPassword(user.ID, string(pwHash)); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update password"})
	}
	if err := s.DB.UpsertKeyWrap(db.KeyWrap{
		OrgID:      orgID,
		UserID:     user.ID,
		WrappedKey: newWrap.Ciphertext,
		WrapSalt:   hex.EncodeToString(newWrap.Salt),
		KDFParams:  newWrap.Params.Encode(),
	}); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update key wrap"})
	}

	_ = s.DB.RevokeUserSessions(orgID, user.Email, actor)
	_ = s.LogAuditOrg(orgID, "PASSWORD_CHANGED", nil, nil, actor, c.IP(), c.Get("User-Agent"))
	_ = s.LogAuditOrg(orgID, "SESSION_REVOKE_ALL", nil, nil, actor, c.IP(), c.Get("User-Agent"))
	return c.JSON(fiber.Map{"status": "password changed"})
}

func (s *Server) findSessionUser(actorID string) (*db.User, error) {
	key, err := s.DB.FindAPIKeyByID(actorID)
	if err != nil || key == nil {
		return nil, err
	}
	if !strings.HasPrefix(key.Name, "Session: ") {
		return nil, nil
	}
	email := strings.TrimPrefix(key.Name, "Session: ")
	return s.DB.GetUserByEmail(email)
}
