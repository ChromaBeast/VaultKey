package api

import (
	"bytes"
	"embed"
	"encoding/json"
	"net/http/httptest"
	"os"
	"testing"
	"vaultkey/internal/config"
	"vaultkey/internal/db"
)

func setupTestServer(t *testing.T) (*Server, func()) {
	tmpDB := "test_otp_" + t.Name() + ".db"
	database, err := db.Open(tmpDB)
	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}

	cfg := config.Default()
	cfg.Environment = "dev"
	cfg.DatabasePath = tmpDB
	cfg.Email.Provider = "console"

	var mockFS embed.FS
	srv := NewServer(cfg, database, mockFS)
	cleanup := func() {
		database.Close()
		_ = os.Remove(tmpDB)
	}
	return srv, cleanup
}

func TestOTPFlow(t *testing.T) {
	srv, cleanup := setupTestServer(t)
	defer cleanup()

	// 1. Create a user via signup
	signupPayload, _ := json.Marshal(map[string]string{
		"org_name": "OTP Test Org",
		"email":    "test@vaultkey.dev",
		"password": "InitialPassword123!",
	})
	req := httptest.NewRequest("POST", "/v1/auth/signup", bytes.NewReader(signupPayload))
	req.Header.Set("Content-Type", "application/json")
	resp, err := srv.App.Test(req)
	if err != nil || resp.StatusCode != 200 {
		t.Fatalf("signup failed with status: %d", resp.StatusCode)
	}

	// 2. Request OTP
	forgotPayload, _ := json.Marshal(map[string]string{
		"email": "test@vaultkey.dev",
	})
	req = httptest.NewRequest("POST", "/v1/auth/forgot-password", bytes.NewReader(forgotPayload))
	req.Header.Set("Content-Type", "application/json")
	resp, err = srv.App.Test(req)
	if err != nil || resp.StatusCode != 200 {
		t.Fatalf("forgot-password failed: %d", resp.StatusCode)
	}

	// Fetch active reset record to inspect salt/code
	active, err := srv.DB.GetActiveResetByEmail("test@vaultkey.dev")
	if err != nil || active == nil {
		t.Fatalf("expected active reset record, got: %v", err)
	}

	// 3. Test invalid OTP verification
	badOtpPayload, _ := json.Marshal(map[string]string{
		"email": "test@vaultkey.dev",
		"code":  "000000",
	})
	req = httptest.NewRequest("POST", "/v1/auth/verify-otp", bytes.NewReader(badOtpPayload))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = srv.App.Test(req)
	if resp.StatusCode != 400 {
		t.Errorf("expected 400 for bad otp, got %d", resp.StatusCode)
	}

	// 4. Manually set known code to verify valid OTP
	testCode := "654321"
	testHash := hashOTP(testCode, active.Salt)
	_, _ = srv.DB.Exec("UPDATE password_resets SET code_hash = ? WHERE id = ?", testHash, active.ID)

	goodOtpPayload, _ := json.Marshal(map[string]string{
		"email": "test@vaultkey.dev",
		"code":  testCode,
	})
	req = httptest.NewRequest("POST", "/v1/auth/verify-otp", bytes.NewReader(goodOtpPayload))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = srv.App.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("expected 200 for good otp, got %d", resp.StatusCode)
	}

	var verifyResult map[string]string
	_ = json.NewDecoder(resp.Body).Decode(&verifyResult)
	resetToken := verifyResult["reset_token"]
	if resetToken == "" {
		t.Fatalf("expected reset_token, got empty")
	}

	// 5. Reset Password
	resetPayload, _ := json.Marshal(map[string]string{
		"reset_token": resetToken,
		"password":    "NewSuperPassword123!",
	})
	req = httptest.NewRequest("POST", "/v1/auth/reset-password", bytes.NewReader(resetPayload))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = srv.App.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("expected 200 for password reset, got %d", resp.StatusCode)
	}

	// 6. Verify reset token is consumed (reusing fails)
	req = httptest.NewRequest("POST", "/v1/auth/reset-password", bytes.NewReader(resetPayload))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = srv.App.Test(req)
	if resp.StatusCode != 400 {
		t.Errorf("expected 400 when reusing reset token, got %d", resp.StatusCode)
	}
}
