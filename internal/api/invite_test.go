package api

import (
	"testing"
)

func TestInviteTokenFlow(t *testing.T) {
	server, _ := testServer(t)

	signup := doJSON(t, server.App, "POST", "/v1/auth/signup", map[string]string{
		"org_name": "Invite Org", "org_slug": "invorg", "email": "admin@inv.com", "password": "admin-password-1",
	}, "")
	if signup.StatusCode != 200 {
		t.Fatalf("admin signup failed: %d %v", signup.StatusCode, decode(t, signup))
	}
	adminToken := decode(t, signup)["token"].(string)

	inviteResp := doJSON(t, server.App, "POST", "/v1/users/invite", map[string]string{
		"email": "member@inv.com", "role": "write",
	}, adminToken)
	if inviteResp.StatusCode != 201 {
		t.Fatalf("invite failed: %d %v", inviteResp.StatusCode, decode(t, inviteResp))
	}
	body := decode(t, inviteResp)
	token, ok := body["token"].(string)
	if !ok || token == "" {
		t.Fatalf("expected invite token in response, got %v", body)
	}

	detailsResp := doJSON(t, server.App, "GET", "/v1/invites/details?token="+token, nil, "")
	if detailsResp.StatusCode != 200 {
		t.Fatalf("get invite details failed: %d %v", detailsResp.StatusCode, decode(t, detailsResp))
	}
	details := decode(t, detailsResp)
	if details["email"] != "member@inv.com" || details["role"] != "write" {
		t.Fatalf("unexpected invite details: %v", details)
	}

	acceptResp := doJSON(t, server.App, "POST", "/v1/auth/accept-invite", map[string]string{
		"token":    token,
		"password": "member-secret-pw-99",
	}, "")
	if acceptResp.StatusCode != 201 {
		t.Fatalf("accept invite failed: %d %v", acceptResp.StatusCode, decode(t, acceptResp))
	}
	acceptBody := decode(t, acceptResp)
	memberSession, ok := acceptBody["token"].(string)
	if !ok || memberSession == "" {
		t.Fatalf("expected member session token on accept, got %v", acceptBody)
	}

	reaccept := doJSON(t, server.App, "POST", "/v1/auth/accept-invite", map[string]string{
		"token":    token,
		"password": "another-password",
	}, "")
	if reaccept.StatusCode != 404 {
		t.Fatalf("expected 404 on reused invite token, got %d", reaccept.StatusCode)
	}

	loginResp := doJSON(t, server.App, "POST", "/v1/auth/login", map[string]string{
		"email":    "member@inv.com",
		"password": "member-secret-pw-99",
	}, "")
	if loginResp.StatusCode != 200 {
		t.Fatalf("member login failed: %d %v", loginResp.StatusCode, decode(t, loginResp))
	}
}
