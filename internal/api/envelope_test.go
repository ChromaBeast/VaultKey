package api

import (
	"bytes"
	crand "crypto/rand"
	"crypto/sha256"
	"embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"sync"
	"testing"
	"vaultkey/internal/config"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"golang.org/x/crypto/argon2"
	"golang.org/x/crypto/bcrypt"
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

func deriveLegacyKeyForTest(password string, salt []byte) []byte {
	return argon2.IDKey([]byte(password), salt, 3, 64*1024, 4, 32)
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
		"email": "dev@env.com", "password": "member-pass-123", "role": "write",
	}, ownerToken)
	if invite.StatusCode != 201 {
		t.Fatalf("invite failed: %d %v", invite.StatusCode, decode(t, invite))
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

func TestLegacyMigrationPreservesData(t *testing.T) {
	server, database := testServer(t)

	orgID := "org_legacy01"
	salt := make([]byte, 32)
	if _, err := crand.Read(salt); err != nil {
		t.Fatal(err)
	}
	legacyKey := deriveLegacyKeyForTest("legacy-pass-123", salt)
	defer crypto.Zero(legacyKey)
	crypto.Global.Set(orgID, legacyKey)

	sentinel, err := crypto.Encrypt(orgID, sentinelPlaintext)
	if err != nil {
		t.Fatal(err)
	}
	crypto.Global.Lock(orgID)

	if err := database.CreateOrganization(db.Organization{
		ID: orgID, Name: "Legacy", Slug: "legacy-" + t.Name(), Argon2Salt: hex.EncodeToString(salt),
		Sentinel: hex.EncodeToString(sentinel), KeyScheme: "legacy", Plan: "free",
	}); err != nil {
		t.Fatal(err)
	}

	encVal, err := crypto.SealWithKey(legacyKey, []byte("legacy-secret-value"))
	if err != nil {
		t.Fatal(err)
	}
	if err := database.CreateSecret(db.Secret{
		ID: "sec_legacy_" + t.Name(), OrgID: orgID, Key: "LEGACY_KEY", Value: encVal,
		Project: "default", Environment: "production", CreatedBy: "setup",
	}); err != nil {
		t.Fatal(err)
	}

	pwHash, err := bcrypt.GenerateFromPassword([]byte("legacy-pass-123"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatal(err)
	}
	user := db.User{ID: "usr_lg1_" + t.Name(), OrgID: orgID, Email: "legacy@" + t.Name() + ".com", PasswordHash: string(pwHash), Role: "owner"}
	if err := database.CreateUser(user); err != nil {
		t.Fatal(err)
	}

	realLogin := doJSON(t, server.App, "POST", "/v1/auth/login", map[string]string{
		"email": user.Email, "password": "legacy-pass-123",
	}, "")
	body := decode(t, realLogin)
	if realLogin.StatusCode != 200 {
		t.Fatalf("legacy login failed: %d %v", realLogin.StatusCode, body)
	}
	token := body["token"].(string)

	got := decode(t, doJSON(t, server.App, "GET", "/v1/secrets/LEGACY_KEY", nil, token))
	if got["value"] != "legacy-secret-value" {
		t.Fatalf("expected migrated legacy secret to decrypt under new KEK, got %v", got["value"])
	}

	org, _ := database.GetOrganizationByID(orgID)
	if org == nil || org.KeyScheme != "envelope" {
		t.Fatalf("expected org migrated to envelope scheme")
	}
}

func TestAuditChainSurvivesConcurrency(t *testing.T) {
	server, _ := testServer(t)

	signup := doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Race Org", "org_slug": "raceorg", "email": "r@r.com", "password": "racepass123",
	}, "")
	signupBody := decode(t, signup)
	token := signupBody["token"].(string)
	orgID := signupBody["org"].(map[string]any)["id"].(string)

	var wg sync.WaitGroup
	for i := 0; i < 30; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			key := fmt.Sprintf("K%d", n)
			_ = server.LogAuditOrg(orgID, "WRITE", &key, nil, "actor-test", "127.0.0.1", "test")
		}(i)
	}
	wg.Wait()

	verify := decode(t, doJSON(t, server.App, "GET", "/v1/audit/verify", nil, token))
	if verify["verified"] != true {
		t.Fatalf("audit chain forked under concurrency: %v", verify)
	}
}

func TestRollbackRequiresWritePermission(t *testing.T) {
	server, database := testServer(t)

	signup := doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Rb Org", "org_slug": "rborg", "email": "rb@r.com", "password": "rollback123",
	}, "")
	signupBody := decode(t, signup)
	ownerToken := signupBody["token"].(string)
	orgID := signupBody["org"].(map[string]any)["id"].(string)

	doJSON(t, server.App, "POST", "/v1/secrets", map[string]string{"key": "RB", "value": "v1"}, ownerToken)

	rawKey := "vk_readonlykey.deadbeefdeadbeefdeadbeef"
	sum := sha256HexOf(rawKey)
	if err := database.CreateAPIKey(db.APIKey{
		ID: "vk_readonlykey", OrgID: orgID, Name: "ro", KeyHash: sum, Permissions: "read", Active: true,
	}); err != nil {
		t.Fatal(err)
	}

	resp := doJSON(t, server.App, "POST", "/v1/secrets/RB/rollback?project=default&version=1", nil, rawKey)
	if resp.StatusCode != 403 {
		t.Fatalf("expected read-only key denied rollback with 403, got %d", resp.StatusCode)
	}
}

func TestMockPaymentRejectedInProduction(t *testing.T) {
	server, _ := testServer(t)

	signup := doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Pay Org", "org_slug": "payorg", "email": "p@p.com", "password": "paypass123",
	}, "")
	token := decode(t, signup)["token"].(string)

	server.Config.Environment = "production"

	resp := doJSON(t, server.App, "POST", "/v1/subscriptions/verify", map[string]string{
		"razorpay_subscription_id": "sub_fake", "razorpay_payment_id": "pay_fake", "razorpay_signature": "mock_sig_123",
	}, token)
	if resp.StatusCode != 400 {
		t.Fatalf("expected production mock signature rejection (400), got %d", resp.StatusCode)
	}

	server.Config.Environment = "dev"
	resp = doJSON(t, server.App, "POST", "/v1/subscriptions/verify", map[string]string{
		"razorpay_subscription_id": "sub_unknown", "razorpay_payment_id": "pay_fake", "razorpay_signature": "mock_sig_123",
	}, token)
	if resp.StatusCode != 404 {
		t.Fatalf("expected dev mock signature to pass signature stage then 404 on unknown subscription, got %d", resp.StatusCode)
	}
}
