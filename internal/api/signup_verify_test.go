package api

import "testing"

type captureEmail struct{ last string }

func (c *captureEmail) SendOTP(_ string, code string) error {
	c.last = code
	return nil
}

func TestSignupRequiresEmailCode(t *testing.T) {
	server, _ := testServer(t)
	mail := &captureEmail{}
	server.Email = mail
	server.requireEmailVerification = true

	body := map[string]string{
		"org_name": "Verified Org", "org_slug": "verified-org", "email": "Owner@Verified.local", "password": "owner-password-1",
	}
	first := doJSON(t, server.App, "POST", "/v1/auth/signup", body, "")
	if first.StatusCode != 202 || mail.last == "" {
		t.Fatalf("expected 202 with a code sent, got %d", first.StatusCode)
	}

	body["verification_code"] = "000000"
	if resp := doJSON(t, server.App, "POST", "/v1/auth/signup", body, ""); resp.StatusCode != 400 {
		t.Fatalf("wrong code should be rejected, got %d", resp.StatusCode)
	}

	body["verification_code"] = mail.last
	done := decode(t, doJSON(t, server.App, "POST", "/v1/auth/signup", body, ""))
	if done["token"] == nil {
		t.Fatalf("correct code should create the account, got %v", done)
	}
	if email := done["user"].(map[string]any)["email"]; email != "owner@verified.local" {
		t.Fatalf("email should be normalized, got %v", email)
	}

	if resp := doJSON(t, server.App, "POST", "/v1/auth/signup", body, ""); resp.StatusCode != 400 {
		t.Fatalf("code must be single-use, got %d", resp.StatusCode)
	}
}
