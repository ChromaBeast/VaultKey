package api

import (
	"bytes"
	"crypto/sha256"
	"embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"vaultkey/internal/config"
	"vaultkey/internal/db"
)

func sha256HexOf(s string) string {
	h := sha256.Sum256([]byte(s))
	return hex.EncodeToString(h[:])
}

func testServer(t *testing.T) (*Server, *db.DB) {
	t.Helper()
	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", url.PathEscape(t.Name()))
	database, err := db.Open(dsn)
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}
	t.Cleanup(func() { database.Close() })
	cfg := config.Default()
	cfg.Environment = "dev"
	var mockFS embed.FS
	return NewServer(cfg, database, mockFS), database
}

func doJSON(t *testing.T, app interface {
	Test(req *http.Request, ms ...int) (*http.Response, error)
}, method, path string, body any, token string) *http.Response {
	t.Helper()
	var reader *bytes.Reader
	if body != nil {
		b, _ := json.Marshal(body)
		reader = bytes.NewReader(b)
	} else {
		reader = bytes.NewReader(nil)
	}
	req := httptest.NewRequest(method, path, reader)
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	resp, err := app.Test(req, 10000)
	if err != nil {
		t.Fatalf("%s %s failed: %v", method, path, err)
	}
	return resp
}

func decode(t *testing.T, resp *http.Response) map[string]any {
	t.Helper()
	var out map[string]any
	_ = json.NewDecoder(resp.Body).Decode(&out)
	return out
}

func TestMultiUserEnvelopeVault(t *testing.T) {
	server, _ := testServer(t)

	signup := doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Env Org", "org_slug": "envorg", "email": "owner@env.com", "password": "owner-password-1",
	}, "")
	if signup.StatusCode != 200 {
		t.Fatalf("signup failed: %d %v", signup.StatusCode, decode(t, signup))
	}
	ownerToken := decode(t, signup)["token"].(string)

	doJSON(t, server.App, "POST", "/v1/secrets", map[string]string{"key": "API_KEY", "value": "super-secret"}, ownerToken)

	invite := doJSON(t, server.App, "POST", "/v1/users/invite", map[string]string{
		"email": "dev@env.com", "role": "write",
	}, ownerToken)
	if invite.StatusCode != 201 {
		t.Fatalf("invite failed: %d %v", invite.StatusCode, decode(t, invite))
	}
	inviteToken := decode(t, invite)["token"].(string)

	accept := doJSON(t, server.App, "POST", "/v1/auth/accept-invite", map[string]string{
		"token": inviteToken, "password": "member-pass-123",
	}, "")
	if accept.StatusCode != 201 {
		t.Fatalf("accept invite failed: %d %v", accept.StatusCode, decode(t, accept))
	}

	lock := doJSON(t, server.App, "POST", "/v1/vault/lock", nil, ownerToken)
	if lock.StatusCode != 200 {
		t.Fatalf("lock failed: %d", lock.StatusCode)
	}

	unlock := doJSON(t, server.App, "POST", "/v1/vault/unlock", map[string]string{
		"email": "dev@env.com", "password": "member-pass-123",
	}, "")
	if unlock.StatusCode != 200 {
		t.Fatalf("member unlock failed: %d %v", unlock.StatusCode, decode(t, unlock))
	}

	memberLogin := doJSON(t, server.App, "POST", "/v1/auth/login", map[string]string{
		"email": "dev@env.com", "password": "member-pass-123",
	}, "")
	if memberLogin.StatusCode != 200 {
		t.Fatalf("member login failed: %d %v", memberLogin.StatusCode, decode(t, memberLogin))
	}
	memberToken := decode(t, memberLogin)["token"].(string)

	got := decode(t, doJSON(t, server.App, "GET", "/v1/secrets/API_KEY", nil, memberToken))
	if got["value"] != "super-secret" {
		t.Fatalf("expected member to decrypt shared org secret after own unlock, got %v", got["value"])
	}

	badUnlock := doJSON(t, server.App, "POST", "/v1/vault/unlock", map[string]string{
		"email": "dev@env.com", "password": "wrong-password",
	}, "")
	if badUnlock.StatusCode != 401 {
		t.Fatalf("expected 401 for wrong password, got %d", badUnlock.StatusCode)
	}
}


