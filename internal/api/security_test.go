package api

import (
	"bytes"
	"embed"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"vaultkey/internal/config"
	"vaultkey/internal/db"
)

func TestSecurityHeadersAndLockout(t *testing.T) {
	database, err := db.Open("file::memory:?cache=shared")
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}
	defer database.Close()

	cfg := config.Default()
	cfg.MaxLoginAttempts = 3 // Set to 3 for fast test execution
	var mockFS embed.FS
	server := NewServer(cfg, database, mockFS)

	// 1. Verify Security Headers on /v1/vault/status
	req := httptest.NewRequest("GET", "/v1/vault/status", nil)
	resp, _ := server.App.Test(req, 5000)
	if resp.Header.Get("X-Frame-Options") != "DENY" {
		t.Errorf("expected X-Frame-Options DENY, got %s", resp.Header.Get("X-Frame-Options"))
	}
	if resp.Header.Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("expected X-Content-Type-Options nosniff, got %s", resp.Header.Get("X-Content-Type-Options"))
	}
	if resp.Header.Get("Content-Security-Policy") == "" {
		t.Errorf("expected Content-Security-Policy header to be present")
	}

	// 2. Signup User
	signupBody, _ := json.Marshal(map[string]string{
		"org_name": "Test Security Org",
		"org_slug": "secorg",
		"email":    "sec@test.com",
		"password": "CorrectPassword123!",
	})
	req = httptest.NewRequest("POST", "/v1/auth/signup", bytes.NewBuffer(signupBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("signup failed with status %d", resp.StatusCode)
	}

	// 3. Fail Login 3 times to trigger lockout
	invalidLoginBody, _ := json.Marshal(map[string]string{
		"email":    "sec@test.com",
		"password": "WrongPassword!",
	})

	for i := 1; i <= 3; i++ {
		req = httptest.NewRequest("POST", "/v1/auth/login", bytes.NewBuffer(invalidLoginBody))
		req.Header.Set("Content-Type", "application/json")
		resp, _ = server.App.Test(req, 5000)

		if i < 3 {
			if resp.StatusCode != http.StatusUnauthorized {
				t.Fatalf("expected attempt %d to fail with 401, got %d", i, resp.StatusCode)
			}
		} else {
			if resp.StatusCode != http.StatusTooManyRequests {
				t.Fatalf("expected attempt %d to lock account with 429, got %d", i, resp.StatusCode)
			}
		}
	}

	// 4. Attempt correct password while locked -> Should be blocked with 429
	validLoginBody, _ := json.Marshal(map[string]string{
		"email":    "sec@test.com",
		"password": "CorrectPassword123!",
	})
	req = httptest.NewRequest("POST", "/v1/auth/login", bytes.NewBuffer(validLoginBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusTooManyRequests {
		t.Fatalf("expected locked user with correct password to be blocked with 429, got %d", resp.StatusCode)
	}
}
