package api

import (
	"crypto/rand"
	"encoding/hex"
	"strings"
	"time"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func nowPlus24h() time.Time {
	return time.Now().Add(24 * time.Hour)
}

type SignupRequest struct {
	OrgName          string `json:"org_name"`
	OrgSlug          string `json:"org_slug"`
	Email            string `json:"email"`
	Password         string `json:"password"`
	TurnstileToken   string `json:"turnstile_token"`
	VerificationCode string `json:"verification_code"`
}

type LoginRequest struct {
	Email          string `json:"email"`
	Password       string `json:"password"`
	TurnstileToken string `json:"turnstile_token"`
}

func (s *Server) handleAuthConfig(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"turnstile_required": !s.Config.IsDev() || (s.Config.TurnstileSecretKey != "" && s.Config.TurnstileSecretKey != turnstileTestSecret),
		"turnstile_site_key": s.Config.TurnstileSiteKey,
		// Public so the pricing page can show "coming soon" until the five
		// RAZORPAY_* values are set; checkout turns on with no code change.
		"billing_enabled": s.Config.BillingEnabled(),
	})
}

func roleToPermission(role string) string {
	switch role {
	case "owner", "admin":
		return "admin"
	case "write":
		return "write"
	default:
		return "read"
	}
}

func (s *Server) handleSignup(c *fiber.Ctx) error {
	var req SignupRequest
	if err := c.BodyParser(&req); err != nil || req.OrgName == "" || req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "org_name, email, and password are required"})
	}
	if len(req.Password) < 8 {
		return c.Status(400).JSON(fiber.Map{"error": "password must be at least 8 characters"})
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Step 2 of a verified signup proves email ownership with the code; the
	// captcha was already checked in step 1, when the code was sent.
	verifying := s.requireEmailVerification && req.VerificationCode != ""
	if !verifying && !s.VerifyTurnstileToken(req.TurnstileToken, c.IP()) {
		return c.Status(403).JSON(fiber.Map{"error": "security verification failed, please complete the captcha"})
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

	if s.requireEmailVerification {
		if !verifying {
			if err := s.sendSignupCode(req.Email); err != nil {
				return c.Status(502).JSON(fiber.Map{"error": "failed to send verification email"})
			}
			return c.Status(202).JSON(fiber.Map{"status": "verification_required"})
		}
		if msg := s.checkSignupCode(req.Email, req.VerificationCode); msg != "" {
			return c.Status(400).JSON(fiber.Map{"error": msg})
		}
	}

	idBytes := make([]byte, 64)
	if _, err := rand.Read(idBytes); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate identifiers"})
	}

	orgID := "org_" + hex.EncodeToString(idBytes[:8])
	userID := "usr_" + hex.EncodeToString(idBytes[8:16])
	orgSalt := idBytes[16:48]

	kek := make([]byte, 32)
	if _, err := rand.Read(kek); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate vault key"})
	}
	defer crypto.Zero(kek)

	wrap, err := crypto.WrapMasterKey(kek, req.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to wrap vault key"})
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
	}

	org := db.Organization{
		ID:         orgID,
		Name:       req.OrgName,
		Slug:       slug,
		Argon2Salt: hex.EncodeToString(orgSalt),
		KeyScheme:  "envelope",
		Plan:       "free",
	}
	user := db.User{
		ID:           userID,
		OrgID:        orgID,
		Email:        req.Email,
		PasswordHash: string(pwHash),
		Role:         "owner",
	}
	wrapRow := db.KeyWrap{
		OrgID:      orgID,
		UserID:     userID,
		WrappedKey: wrap.Ciphertext,
		WrapSalt:   hex.EncodeToString(wrap.Salt),
		KDFParams:  wrap.Params.Encode(),
	}

	if err := s.DB.CreateOrgWithFounderTx(org, user, wrapRow); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create organization"})
	}

	crypto.Global.Set(orgID, kek)
	token, err := s.createSessionToken(orgID, "Session: "+user.Email, roleToPermission(user.Role))
	if err != nil {
		crypto.Global.Lock(orgID)
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

	if !s.VerifyTurnstileToken(req.TurnstileToken, c.IP()) {
		return c.Status(403).JSON(fiber.Map{"error": "security verification failed, please complete the captcha"})
	}

	user, org, errCode, errMsg := s.authenticate(req.Email, req.Password, c)
	if errMsg != "" {
		return c.Status(errCode).JSON(fiber.Map{"error": errMsg})
	}

	if err := s.openVault(org, user, req.Password); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid email or password"})
	}

	token, err := s.createSessionToken(org.ID, "Session: "+user.Email, roleToPermission(user.Role))
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
