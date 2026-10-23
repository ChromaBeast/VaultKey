package api

import (
	"testing"
	"vaultkey/internal/db"
)

func TestAuthConfigMatchesTurnstilePolicy(t *testing.T) {
	server, _ := testServer(t)
	for _, tc := range []struct {
		env, secret string
		required    bool
	}{
		{"dev", "", false}, {"dev", turnstileTestSecret, false},
		{"dev", "real-key", true}, {"production", "real-key", true},
		{"production", "", true}, {"production", turnstileTestSecret, true},
	} {
		t.Run(tc.env+"/"+tc.secret, func(t *testing.T) {
			server.Config.Environment = tc.env
			server.Config.TurnstileSecretKey = tc.secret
			body := decode(t, doJSON(t, server.App, "GET", "/v1/auth/config", nil, ""))
			if body["turnstile_required"] != tc.required {
				t.Fatalf("unexpected captcha requirement: %v", body)
			}
		})
	}
}

func TestBillingChangesRequireAdmin(t *testing.T) {
	server, database := testServer(t)
	signup := decode(t, doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Billing roles", "org_slug": "billing-roles", "email": "billing@review.local", "password": "review-password",
	}, ""))
	orgID := signup["org"].(map[string]any)["id"].(string)
	raw := "vk_billingread.test"
	if err := database.CreateAPIKey(db.APIKey{ID: "vk_billingread", OrgID: orgID, Name: "read", KeyHash: sha256HexOf(raw), Permissions: "read", Active: true}); err != nil {
		t.Fatal(err)
	}
	for _, route := range []string{"/payments/create-order", "/payments/verify", "/subscriptions/create", "/subscriptions/verify", "/subscriptions/cancel"} {
		response := doJSON(t, server.App, "POST", "/v1"+route, map[string]string{}, raw)
		if response.StatusCode != 403 {
			t.Errorf("%s: expected 403, got %d", route, response.StatusCode)
		}
	}
	history := doJSON(t, server.App, "GET", "/v1/payments/history", nil, raw)
	if history.StatusCode != 403 {
		t.Fatalf("payment history: expected 403, got %d", history.StatusCode)
	}
}
