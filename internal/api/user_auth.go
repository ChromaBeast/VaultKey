package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	OrgName  string `json:"org_name"`
	OrgSlug  string `json:"org_slug"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) handleSignup(c *fiber.Ctx) error {
	var req SignupRequest
	if err := c.BodyParser(&req); err != nil || req.OrgName == "" || req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "org_name, email, and password are required"})
	}

	slug := strings.ToLower(strings.TrimSpace(req.OrgSlug))
	if slug == "" {
		slug = strings.ToLower(strings.ReplaceAll(strings.TrimSpace(req.OrgName), " ", "-"))
	}

	existingOrg, _ := s.DB.GetOrganizationBySlug(slug)
	if existingOrg != nil {
		return c.Status(400).JSON(fiber.Map{"error": "organization slug already exists"})
	}

	existingUser, _ := s.DB.GetUserByEmail(req.Email)
	if existingUser != nil {
		return c.Status(400).JSON(fiber.Map{"error": "email is already registered"})
	}

	salt := make([]byte, 32)
	if _, err := rand.Read(salt); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate salt"})
	}
	saltHex := hex.EncodeToString(salt)

	orgID := "org_" + hex.EncodeToString(salt[:8])
	crypto.Global.Derive(orgID, req.Password, salt)

	sentinelCipher, err := crypto.Encrypt(orgID, "vaultkey_sentinel")
	if err != nil {
		crypto.Global.Lock(orgID)
		return c.Status(500).JSON(fiber.Map{"error": "failed to encrypt sentinel"})
	}

	org := db.Organization{
		ID:         orgID,
		Name:       req.OrgName,
		Slug:       slug,
		Argon2Salt: saltHex,
		Sentinel:   hex.EncodeToString(sentinelCipher),
		Plan:       "free",
	}
	if err := s.DB.CreateOrganization(org); err != nil {
		crypto.Global.Lock(orgID)
		return c.Status(500).JSON(fiber.Map{"error": "failed to create organization"})
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
	}

	user := db.User{
		ID:           "usr_" + hex.EncodeToString(salt[8:16]),
		OrgID:        orgID,
		Email:        req.Email,
		PasswordHash: string(pwHash),
		Role:         "owner",
	}
	if err := s.DB.CreateUser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create user"})
	}

	token, err := s.createSessionToken(orgID, "Session: "+user.Email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create session key"})
	}

	_ = s.LogAuditOrg(orgID, "SIGNUP", nil, nil, user.ID, c.IP(), c.Get("User-Agent"))
	return c.JSON(fiber.Map{
		"status": "success",
		"token":  token,
		"org":    org,
		"user":   user,
	})
}

func (s *Server) handleLogin(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil || req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email and password are required"})
	}

	user, err := s.DB.GetUserByEmail(req.Email)
	if err != nil || user == nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid email or password"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid email or password"})
	}

	org, err := s.DB.GetOrganizationByID(user.OrgID)
	if err != nil || org == nil {
		return c.Status(500).JSON(fiber.Map{"error": "organization not found"})
	}

	salt, err := hex.DecodeString(org.Argon2Salt)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "corrupted salt"})
	}

	crypto.Global.Derive(org.ID, req.Password, salt)

	sentinelCipher, err := hex.DecodeString(org.Sentinel)
	if err == nil {
		decrypted, err := crypto.Decrypt(org.ID, sentinelCipher)
		if err != nil || decrypted != "vaultkey_sentinel" {
			crypto.Global.Lock(org.ID)
			return c.Status(401).JSON(fiber.Map{"error": "incorrect password decryption check"})
		}
	}

	token, err := s.createSessionToken(org.ID, "Session: "+user.Email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create session key"})
	}

	_ = s.LogAuditOrg(org.ID, "LOGIN", nil, nil, user.ID, c.IP(), c.Get("User-Agent"))
	return c.JSON(fiber.Map{
		"status": "unlocked",
		"token":  token,
		"org":    org,
		"user":   user,
	})
}

func (s *Server) createSessionToken(orgID, name string) (string, error) {
	keyBytes := make([]byte, 16)
	secBytes := make([]byte, 24)
	if _, err := rand.Read(keyBytes); err != nil {
		return "", fmt.Errorf("failed to generate key bytes: %w", err)
	}
	if _, err := rand.Read(secBytes); err != nil {
		return "", fmt.Errorf("failed to generate secret bytes: %w", err)
	}

	id := "vk_" + hex.EncodeToString(keyBytes[:6])
	secret := hex.EncodeToString(secBytes)
	rawToken := id + "." + secret

	h := sha256.Sum256([]byte(rawToken))
	hashed := hex.EncodeToString(h[:])

	expiresAt := time.Now().Add(24 * time.Hour)
	apiKey := db.APIKey{
		ID:          id,
		OrgID:       orgID,
		Name:        name,
		KeyHash:     hashed,
		Permissions: "admin",
		ExpiresAt:   &expiresAt,
		Active:      true,
	}
	if err := s.DB.CreateAPIKey(apiKey); err != nil {
		return "", err
	}
	return rawToken, nil
}

