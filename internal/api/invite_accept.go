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

type AcceptInviteRequest struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

func (s *Server) handleGetInviteDetails(c *fiber.Ctx) error {
	token := strings.TrimSpace(c.Query("token"))
	if token == "" {
		return c.Status(400).JSON(fiber.Map{"error": "invite token is required"})
	}

	inv, err := s.DB.GetInviteByToken(token)
	if err != nil || inv == nil {
		return c.Status(404).JSON(fiber.Map{"error": "invitation is invalid or has expired"})
	}

	org, err := s.DB.GetOrganizationByID(inv.OrgID)
	orgName := "Organization"
	if err == nil && org != nil {
		orgName = org.Name
	}

	return c.JSON(fiber.Map{
		"token":      inv.Token,
		"email":      inv.Email,
		"role":       inv.Role,
		"org_name":   orgName,
		"expires_at": inv.ExpiresAt,
	})
}

func (s *Server) handleAcceptInvite(c *fiber.Ctx) error {
	var req AcceptInviteRequest
	if err := c.BodyParser(&req); err != nil || req.Token == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "token and password are required"})
	}
	if len(req.Password) < 8 {
		return c.Status(400).JSON(fiber.Map{"error": "password must be at least 8 characters"})
	}

	inv, err := s.DB.GetInviteByToken(req.Token)
	if err != nil || inv == nil {
		return c.Status(404).JSON(fiber.Map{"error": "invitation is invalid or has expired"})
	}

	if existing, _ := s.DB.GetUserByEmail(inv.Email); existing != nil {
		_ = s.DB.DeleteInvite(inv.Token)
		return c.Status(400).JSON(fiber.Map{"error": "an account with this email already exists"})
	}

	key, err := cryptoGetKey(inv.OrgID)
	if err != nil {
		return c.Status(423).JSON(fiber.Map{
			"error": "organization vault is locked; an administrator must unlock the vault before you can accept",
			"code":  "VAULT_LOCKED",
		})
	}
	defer crypto.Zero(key)

	wrap, err := crypto.WrapMasterKey(key, req.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to wrap vault key for new member"})
	}

	idBytes := make([]byte, 8)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate user identifier"})
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
	}

	user := db.User{
		ID:           "usr_" + hex.EncodeToString(idBytes),
		OrgID:        inv.OrgID,
		Email:        inv.Email,
		PasswordHash: string(pwHash),
		Role:         inv.Role,
	}
	wrapRow := db.KeyWrap{
		OrgID:      inv.OrgID,
		UserID:     user.ID,
		WrappedKey: wrap.Ciphertext,
		WrapSalt:   hex.EncodeToString(wrap.Salt),
		KDFParams:  wrap.Params.Encode(),
	}

	if err := s.DB.WithTx(func(tx *db.Tx) error {
		return createUserWithWrapTx(tx, user, wrapRow)
	}); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to activate account"})
	}

	_ = s.DB.DeleteInvite(inv.Token)
	_ = s.LogAuditOrg(inv.OrgID, "USER_JOINED", nil, nil, user.ID+" ("+user.Email+")", c.IP(), c.Get("User-Agent"))

	token, err := s.createSessionToken(inv.OrgID, "Session: "+user.Email, roleToPermission(user.Role))
	if err != nil {
		return c.JSON(fiber.Map{"status": "accepted", "user": user})
	}

	org, _ := s.DB.GetOrganizationByID(inv.OrgID)
	return c.Status(201).JSON(fiber.Map{
		"status": "accepted",
		"token":  token,
		"user":   user,
		"org":    org,
	})
}
