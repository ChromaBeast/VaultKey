package api

import (
	"crypto/rand"
	"encoding/hex"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Signup codes share the password_resets table (keyed by email, 10-minute
// expiry, 5 attempts). The "sgv_" ID prefix keeps them apart from reset codes:
// signup codes only exist for unregistered emails, reset codes for registered.
const signupCodePrefix = "sgv_"

func (s *Server) sendSignupCode(email string) error {
	code, err := generateOTP()
	if err != nil {
		return err
	}
	saltBytes := make([]byte, 16)
	if _, err := rand.Read(saltBytes); err != nil {
		return err
	}
	salt := hex.EncodeToString(saltBytes)
	id := signupCodePrefix + hex.EncodeToString(saltBytes[:8])
	if err := s.DB.CreatePasswordReset(id, email, hashOTP(code, salt), salt, time.Now().Add(10*time.Minute)); err != nil {
		return err
	}
	return s.Email.SendOTP(email, code)
}

// checkSignupCode consumes a valid code and returns "" or a user-facing error.
func (s *Server) checkSignupCode(email, code string) string {
	pending, err := s.DB.GetActiveResetByEmail(email)
	if err != nil || pending == nil || !strings.HasPrefix(pending.ID, signupCodePrefix) {
		return "verification code expired. Request a new one"
	}
	if pending.Attempts >= 5 {
		_ = s.DB.DeleteReset(pending.ID)
		return "too many failed attempts. Request a new code"
	}
	if hashOTP(strings.TrimSpace(code), pending.Salt) != pending.CodeHash {
		_, _ = s.DB.IncrementResetAttempts(pending.ID)
		return "incorrect verification code"
	}
	_ = s.DB.DeleteReset(pending.ID)
	return ""
}

// handleSignupResend re-sends a code only for an email that already passed the
// captcha-protected first signup step, so it can't be used to spam addresses.
func (s *Server) handleSignupResend(c *fiber.Ctx) error {
	var req struct {
		Email string `json:"email"`
	}
	if err := c.BodyParser(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email is required"})
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	pending, _ := s.DB.GetActiveResetByEmail(email)
	if pending == nil || !strings.HasPrefix(pending.ID, signupCodePrefix) {
		return c.Status(400).JSON(fiber.Map{"error": "no pending signup for this email. Start again"})
	}
	if time.Since(pending.CreatedAt) < 60*time.Second {
		return c.Status(429).JSON(fiber.Map{"error": "please wait before requesting another code"})
	}
	if err := s.sendSignupCode(email); err != nil {
		return c.Status(502).JSON(fiber.Map{"error": "failed to send verification email"})
	}
	return c.JSON(fiber.Map{"status": "verification_required"})
}
