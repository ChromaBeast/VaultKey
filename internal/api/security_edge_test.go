package api

import (
	"fmt"
	"sync"
	"testing"
	"vaultkey/internal/db"
)

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

func TestPasswordChangeRevokesOldSessions(t *testing.T) {
	server, _ := testServer(t)

	signup := doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Pw Org", "org_slug": "pworg", "email": "user@pw.com", "password": "password123",
	}, "")
	token1 := decode(t, signup)["token"].(string)

	login := doJSON(t, server.App, "POST", "/v1/auth/login", map[string]string{
		"email": "user@pw.com", "password": "password123",
	}, "")
	token2 := decode(t, login)["token"].(string)

	change := doJSON(t, server.App, "POST", "/v1/account/password", map[string]string{
		"current_password": "password123", "new_password": "newpassword456",
	}, token2)
	if change.StatusCode != 200 {
		t.Fatalf("password change failed: %d %v", change.StatusCode, decode(t, change))
	}

	check2 := doJSON(t, server.App, "GET", "/v1/secrets", nil, token2)
	if check2.StatusCode != 200 {
		t.Fatalf("current session should remain valid after password change, got %d", check2.StatusCode)
	}

	check1 := doJSON(t, server.App, "GET", "/v1/secrets", nil, token1)
	if check1.StatusCode != 401 {
		t.Fatalf("old session should be revoked after password change, got %d", check1.StatusCode)
	}
}

