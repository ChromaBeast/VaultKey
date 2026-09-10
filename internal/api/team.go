package api

import (
	"crypto/rand"
	"encoding/hex"
	"strings"
	"time"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

var inviteableRoles = map[string]bool{"admin": true, "write": true, "read": true}

func createUserWithWrapTx(tx *db.Tx, user db.User, wrap db.KeyWrap) error {
	if _, err := tx.Exec(
		`INSERT INTO users (id, org_id, email, password_hash, role, failed_attempts, locked_until) VALUES (?, ?, ?, ?, ?, 0, NULL)`,
		user.ID, user.OrgID, user.Email, user.PasswordHash, user.Role,
	); err != nil {
		return err
	}
	_, err := tx.Exec(
		`INSERT INTO key_wraps (org_id, user_id, wrapped_key, wrap_salt, kdf_params) VALUES (?, ?, ?, ?, ?)`,
		wrap.OrgID, wrap.UserID, wrap.WrappedKey, wrap.WrapSalt, wrap.KDFParams,
	)
	return err
}

func requireAdmin(c *fiber.Ctx) bool {
	p, _ := c.Locals("permissions").(string)
	return p == "admin"
}

func (s *Server) handleListUsers(c *fiber.Ctx) error {
	if !requireAdmin(c) {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}
	orgID := c.Locals("org_id").(string)
	users, err := s.DB.ListUsersByOrg(orgID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to list users"})
	}
	if users == nil {
		users = []db.User{}
	}
	return c.JSON(users)
}

type InviteUserRequest struct {
	Email string `json:"email"`
	Role  string `json:"role"`
}

func (s *Server) handleInviteUser(c *fiber.Ctx) error {
	if !requireAdmin(c) {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}
	orgID := c.Locals("org_id").(string)
	actor := c.Locals("actor").(string)

	var req InviteUserRequest
	if err := c.BodyParser(&req); err != nil || req.Email == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email is required"})
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.Role = strings.ToLower(strings.TrimSpace(req.Role))
	if req.Role == "" {
		req.Role = "read"
	}
	if !inviteableRoles[req.Role] {
		return c.Status(400).JSON(fiber.Map{"error": "role must be one of: admin, write, read"})
	}

	if existing, _ := s.DB.GetUserByEmail(req.Email); existing != nil {
		return c.Status(400).JSON(fiber.Map{"error": "email is already registered"})
	}

	tokenBytes := make([]byte, 16)
	if _, err := rand.Read(tokenBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate invite token"})
	}
	token := "inv_" + hex.EncodeToString(tokenBytes)

	inv := db.Invite{
		Token:     token,
		OrgID:     orgID,
		Email:     req.Email,
		Role:      req.Role,
		CreatedBy: actor,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := s.DB.CreateInvite(inv); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to store invitation"})
	}

	_ = s.LogAuditOrg(orgID, "USER_INVITED", nil, nil, actor+"->"+req.Email, c.IP(), c.Get("User-Agent"))

	return c.Status(201).JSON(fiber.Map{
		"token":      token,
		"invite_url": "/accept-invite?token=" + token,
		"email":      req.Email,
		"role":       req.Role,
		"expires_at": inv.ExpiresAt,
	})
}

func (s *Server) handleDeleteUser(c *fiber.Ctx) error {
	if !requireAdmin(c) {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}
	orgID := c.Locals("org_id").(string)
	actor, _ := c.Locals("actor").(string)
	targetID := c.Params("id")

	target, err := s.DB.GetUserByID(targetID)
	if err != nil || target == nil || target.OrgID != orgID {
		return c.Status(404).JSON(fiber.Map{"error": "user not found"})
	}
	if target.Role == "owner" {
		return c.Status(403).JSON(fiber.Map{"error": "the organization owner cannot be removed"})
	}
	if target.Role == "admin" {
		admins, _ := s.DB.CountAdminsByOrg(orgID)
		if admins <= 1 {
			return c.Status(403).JSON(fiber.Map{"error": "cannot remove the last admin"})
		}
	}

	n, err := s.DB.DeleteUser(orgID, targetID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to remove member"})
	}
	if n == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "user not found"})
	}

	_ = s.LogAuditOrg(orgID, "USER_REMOVED", nil, nil, actor+"->"+target.Email, c.IP(), c.Get("User-Agent"))
	return c.JSON(fiber.Map{"status": "removed"})
}
