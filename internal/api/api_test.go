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

func TestAPIServer(t *testing.T) {
	database, err := db.Open("file::memory:?cache=shared")
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}
	defer database.Close()

	cfg := config.Default()
	var mockFS embed.FS
	server := NewServer(cfg, database, mockFS)

	// 1. Vault Status
	req := httptest.NewRequest("GET", "/v1/vault/status", nil)
	resp, _ := server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	// 2. Signup new SaaS Team
	signupBody, _ := json.Marshal(map[string]string{
		"org_name": "Acme Corp",
		"org_slug": "acme",
		"email":    "admin@acme.com",
		"password": "my-vault-pass",
	})
	req = httptest.NewRequest("POST", "/v1/auth/signup", bytes.NewBuffer(signupBody))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusOK {
		buf := new(bytes.Buffer)
		_, _ = buf.ReadFrom(resp.Body)
		t.Fatalf("signup failed: %d, body: %s", resp.StatusCode, buf.String())
	}

	var signupRes map[string]interface{}
	_ = json.NewDecoder(resp.Body).Decode(&signupRes)
	token := signupRes["token"].(string)

	// 3. Create Secret via REST API
	secBody, _ := json.Marshal(map[string]string{
		"key":         "DB_URI",
		"value":       "mongodb://localhost:27017",
		"project":     "backend",
		"environment": "staging",
	})
	req = httptest.NewRequest("POST", "/v1/secrets", bytes.NewBuffer(secBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ = server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusCreated {
		buf := new(bytes.Buffer)
		_, _ = buf.ReadFrom(resp.Body)
		t.Fatalf("create secret failed: %d, body: %s", resp.StatusCode, buf.String())
	}

	// 4. Get Secret via REST API
	req = httptest.NewRequest("GET", "/v1/secrets/DB_URI?project=backend&environment=staging", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ = server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusOK {
		buf := new(bytes.Buffer)
		_, _ = buf.ReadFrom(resp.Body)
		t.Fatalf("get secret failed: %d, body: %s", resp.StatusCode, buf.String())
	}

	var getRes map[string]interface{}
	_ = json.NewDecoder(resp.Body).Decode(&getRes)
	if getRes["value"] != "mongodb://localhost:27017" {
		t.Fatalf("expected decrypted value, got %v", getRes["value"])
	}

	// 5. Verify Tamper-proof Audit log verification
	req = httptest.NewRequest("GET", "/v1/audit/verify", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ = server.App.Test(req, 5000)
	if resp.StatusCode != http.StatusOK {
		buf := new(bytes.Buffer)
		_, _ = buf.ReadFrom(resp.Body)
		t.Fatalf("verify audit failed: %d, body: %s", resp.StatusCode, buf.String())
	}

	var verifyRes map[string]interface{}
	_ = json.NewDecoder(resp.Body).Decode(&verifyRes)
	if verifyRes["verified"] != true {
		t.Fatalf("expected audit chain to be verified, got %v", verifyRes["verified"])
	}
}
