package api

import (
	"testing"
	"vaultkey/internal/crypto"
)

func TestMachineTokenReopensIdleLockedVault(t *testing.T) {
	server, _ := testServer(t)
	signup := decode(t, doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Token Org", "org_slug": "token-org", "email": "owner@token.local", "password": "owner-password-1",
	}, ""))
	session := signup["token"].(string)
	orgID := signup["org"].(map[string]any)["id"].(string)

	created := decode(t, doJSON(t, server.App, "POST", "/v1/api-keys", map[string]string{
		"name": "ci", "permissions": "read",
	}, session))
	machine := created["token"].(string)

	// Simulate idle auto-lock or a server restart.
	crypto.Global.Lock(orgID)
	if resp := doJSON(t, server.App, "GET", "/v1/secrets", nil, machine); resp.StatusCode != 200 {
		t.Fatalf("machine token should reopen an idle-locked vault, got %d", resp.StatusCode)
	}
	if crypto.Global.IsLocked(orgID) {
		t.Fatal("vault should be unlocked after machine token use")
	}

	// An explicit admin lock seals the vault against token unwrap.
	if resp := doJSON(t, server.App, "POST", "/v1/vault/lock", nil, session); resp.StatusCode != 200 {
		t.Fatalf("lock failed: %d", resp.StatusCode)
	}
	if resp := doJSON(t, server.App, "GET", "/v1/secrets", nil, machine); resp.StatusCode != 423 {
		t.Fatalf("sealed vault must stay locked for tokens, got %d", resp.StatusCode)
	}

	// A password unlock clears the seal.
	if resp := doJSON(t, server.App, "POST", "/v1/vault/unlock", map[string]string{
		"email": "owner@token.local", "password": "owner-password-1",
	}, ""); resp.StatusCode != 200 {
		t.Fatalf("unlock failed: %d", resp.StatusCode)
	}
	crypto.Global.Lock(orgID)
	if resp := doJSON(t, server.App, "GET", "/v1/secrets", nil, machine); resp.StatusCode != 200 {
		t.Fatalf("token should work again after password unlock, got %d", resp.StatusCode)
	}
}

func TestWrongTokenCannotUnwrapOrgKey(t *testing.T) {
	key := []byte("0123456789abcdef0123456789abcdef")
	wrapped, err := crypto.WrapForToken(key, "vk_a.secret", "vk_a")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := crypto.UnwrapForToken(wrapped, "vk_a.other", "vk_a"); err == nil {
		t.Fatal("unwrap with a different token secret must fail")
	}
	if _, err := crypto.UnwrapForToken(wrapped, "vk_a.secret", "vk_b"); err == nil {
		t.Fatal("unwrap bound to a different key id must fail")
	}
}
