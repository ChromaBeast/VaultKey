package api

import (
	crand "crypto/rand"
	"encoding/hex"
	"testing"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"golang.org/x/crypto/bcrypt"
)

func TestLegacyMigrationPreservesData(t *testing.T) {
	server, database := testServer(t)

	orgID := "org_legacy_" + t.Name()
	legacySalt := make([]byte, 32)
	_, _ = crand.Read(legacySalt)

	crypto.Global.Derive(orgID, "legacy-pass-123", legacySalt)
	legacyKey, _ := crypto.Global.Get(orgID)

	sentinel, err := crypto.Encrypt(orgID, sentinelPlaintext)
	if err != nil {
		t.Fatal(err)
	}
	crypto.Global.Lock(orgID)

	if err := database.CreateOrganization(db.Organization{
		ID: orgID, Name: "Legacy Org", Slug: "legacyorg-" + t.Name(), Argon2Salt: hex.EncodeToString(legacySalt),
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
