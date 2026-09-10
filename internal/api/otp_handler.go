package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type VerifyOTPRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type ResetPasswordRequest struct {
	ResetToken string `json:"reset_token"`
	Password   string `json:"password"`
}

func hashOTP(code, salt string) string {
	h := sha256.Sum256([]byte(salt + ":" + code))
	return hex.EncodeToString(h[:])
}

func generateOTP() (string, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()+100000), nil
}

func (s *Server) handleForgotPassword(c *fiber.Ctx) error {
	var req ForgotPasswordRequest
	if err := c.BodyParser(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email is required"})
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	user, err := s.DB.GetUserByEmail(email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to query user"})
	}

	// Always return success to prevent email enumeration
	if user == nil {
		return c.JSON(fiber.Map{"status": "ok", "message": "If that email exists, an OTP has been sent."})
	}

	active, _ := s.DB.GetActiveResetByEmail(email)
	if active != nil && time.Since(active.CreatedAt) < 60*time.Second {
		return c.Status(429).JSON(fiber.Map{"error": "please wait before requesting another code"})
	}

	code, err := generateOTP()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate otp"})
	}

	saltBytes := make([]byte, 16)
	_, _ = rand.Read(saltBytes)
	salt := hex.EncodeToString(saltBytes)
	codeHash := hashOTP(code, salt)

	resetID := "rst_" + hex.EncodeToString(saltBytes[:8])
	expiresAt := time.Now().Add(10 * time.Minute)

	if err := s.DB.CreatePasswordReset(resetID, email, codeHash, salt, expiresAt); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to store reset request"})
	}

	if s.Email != nil {
		_ = s.Email.SendOTP(email, code)
	}

	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "If that email exists, an OTP has been sent.",
	})
}

func (s *Server) handleVerifyOTP(c *fiber.Ctx) error {
	var req VerifyOTPRequest
	if err := c.BodyParser(&req); err != nil || req.Email == "" || req.Code == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email and 6-digit code are required"})
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	reset, err := s.DB.GetActiveResetByEmail(email)
	if err != nil || reset == nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid or expired verification code"})
	}

	if reset.Attempts >= 5 {
		_ = s.DB.DeleteReset(reset.ID)
		return c.Status(429).JSON(fiber.Map{"error": "too many failed attempts. Please request a new code"})
	}

	expectedHash := hashOTP(strings.TrimSpace(req.Code), reset.Salt)
	if expectedHash != reset.CodeHash {
		_, _ = s.DB.IncrementResetAttempts(reset.ID)
		return c.Status(400).JSON(fiber.Map{"error": "incorrect verification code"})
	}

	tokenBytes := make([]byte, 24)
	_, _ = rand.Read(tokenBytes)
	resetToken := "vkr_" + hex.EncodeToString(tokenBytes)

	if err := s.DB.SetResetToken(reset.ID, resetToken); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to authorize reset token"})
	}

	return c.JSON(fiber.Map{
		"status":      "ok",
		"reset_token": resetToken,
	})
}

func (s *Server) handleResetPassword(c *fiber.Ctx) error {
	var req ResetPasswordRequest
	if err := c.BodyParser(&req); err != nil || req.ResetToken == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "reset_token and new password are required"})
	}

	if len(req.Password) < 8 {
		return c.Status(400).JSON(fiber.Map{"error": "password must be at least 8 characters"})
	}

	reset, err := s.DB.GetResetByToken(req.ResetToken)
	if err != nil || reset == nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid or expired reset token"})
	}

	user, err := s.DB.GetUserByEmail(reset.Email)
	if err != nil || user == nil {
		return c.Status(404).JSON(fiber.Map{"error": "user not found"})
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to hash password"})
	}

	if err := s.DB.UpdateUserPassword(user.ID, string(pwHash)); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update password"})
	}

	_ = s.DB.DeleteReset(reset.ID)
	_ = s.LogAuditOrg(user.OrgID, "PASSWORD_RESET", nil, nil, user.ID, c.IP(), c.Get("User-Agent"))

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Password updated successfully",
	})
}
