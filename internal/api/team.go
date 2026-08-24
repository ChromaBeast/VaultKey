package api

import (
	"crypto/rand"
	"encoding/hex"
	"strings"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
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
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func (s *Server) handleInviteUser(c *fiber.Ctx) error {
	if !requireAdmin(c) {
		return c.Status(403).JSON(fiber.Map{"error": "admin access required"})
	}
	orgID := c.Locals("org_id").(string)
	actor := c.Locals("actor").(string)

	var req InviteUserRequest
	if err := c.BodyParser(&req); err != nil || req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email and password are required"})
	}
	req.Role = strings.ToLower(strings.TrimSpace(req.Role))
	if !inviteableRoles[req.Role] {
		return c.Status(400).JSON(fiber.Map{"error": "role must be one of: admin, write, read"})
	}
	if len(req.Password) < 8 {
		return c.Status(400).JSON(fiber.Map{"error": "password must be at least 8 characters"})
	}

	if existing, _ := s.DB.GetUserByEmail(req.Email); existing != nil {
		return c.Status(400).JSON(fiber.Map{"error": "email is already registered"})
	}

	key, err := cryptoGetKey(orgID)
	if err != nil {
		return c.Status(423).JSON(fiber.Map{"error": "vault must be unlocked to invite members", "code": "VAULT_LOCKED"})
	}
	defer crypto.Zero(key)

	wrap, err := crypto.WrapMasterKey(key, req.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to wrap vault key for member"})
	}

	idBytes := make([]byte, 8)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate user ID"})
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
	}

	user := db.User{
		ID:           "usr_" + hex.EncodeToString(idBytes),
		OrgID:        orgID,
		Email:        req.Email,
		PasswordHash: string(pwHash),
		Role:         req.Role,
	}
	wrapRow := db.KeyWrap{
		OrgID:      orgID,
		UserID:     user.ID,
		WrappedKey: wrap.Ciphertext,
		WrapSalt:   hex.EncodeToString(wrap.Salt),
		KDFParams:  wrap.Params.Encode(),
	}

	if err := s.DB.WithTx(func(tx *db.Tx) error {
		return createUserWithWrapTx(tx, user, wrapRow)
	}); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create member"})
	}

	_ = s.LogAuditOrg(orgID, "USER_INVITED", nil, nil, actor+"->"+user.Email, c.IP(), c.Get("User-Agent"))
	return c.Status(201).JSON(user)
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
