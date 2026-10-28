package api

import "testing"

func TestFreePlanGatesTeamFeatures(t *testing.T) {
	server, database := testServer(t)
	signup := decode(t, doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Free Org", "org_slug": "free-org", "email": "owner@free.local", "password": "owner-password-1",
	}, ""))
	session := signup["token"].(string)
	orgID := signup["org"].(map[string]any)["id"].(string)

	invite := func(email string) int {
		return doJSON(t, server.App, "POST", "/v1/users/invite", map[string]string{"email": email, "role": "read"}, session).StatusCode
	}
	if code := invite("second@free.local"); code != 201 {
		t.Fatalf("free plan should allow a second seat, got %d", code)
	}
	if code := invite("third@free.local"); code != 402 {
		t.Fatalf("free plan should block a third seat, got %d", code)
	}
	share := doJSON(t, server.App, "POST", "/v1/shares", map[string]any{"secret": "s3cret", "max_views": 1}, session)
	if share.StatusCode != 402 {
		t.Fatalf("free plan should block share links, got %d", share.StatusCode)
	}

	if err := database.UpdateOrganizationPlan(orgID, "pro"); err != nil {
		t.Fatal(err)
	}
	if code := invite("third@free.local"); code != 201 {
		t.Fatalf("paid plan should allow more seats, got %d", code)
	}
	share = doJSON(t, server.App, "POST", "/v1/shares", map[string]any{"secret": "s3cret", "max_views": 1}, session)
	if share.StatusCode == 402 {
		t.Fatal("paid plan should allow share links")
	}
}

func TestAuthConfigReportsBillingSwitch(t *testing.T) {
	server, _ := testServer(t)
	if on := decode(t, doJSON(t, server.App, "GET", "/v1/auth/config", nil, ""))["billing_enabled"]; on != false {
		t.Fatalf("billing should be off without Razorpay settings, got %v", on)
	}
	cfg := server.Config
	cfg.RazorpayKeyID, cfg.RazorpayKeySecret, cfg.RazorpayWebhookSecret = "rzp_live_x", "secret", "whsec"
	cfg.RazorpayPlanProID, cfg.RazorpayPlanEntID = "plan_pro", "plan_ent"
	if on := decode(t, doJSON(t, server.App, "GET", "/v1/auth/config", nil, ""))["billing_enabled"]; on != true {
		t.Fatalf("billing should turn on once all five values are set, got %v", on)
	}
}
