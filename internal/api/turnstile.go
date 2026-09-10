package api

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"
)

const turnstileTestSecret = "1x0000000000000000000000000000000AA"

type TurnstileResponse struct {
	Success     bool     `json:"success"`
	ErrorCodes  []string `json:"error-codes,omitempty"`
	ChallengeTS string   `json:"challenge_ts,omitempty"`
	Hostname    string   `json:"hostname,omitempty"`
}

func (s *Server) VerifyTurnstileToken(token, clientIP string) bool {
	secret := s.Config.TurnstileSecretKey
	if secret == "" || secret == turnstileTestSecret {
		return true
	}

	if token == "" {
		return false
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.PostForm("https://challenges.cloudflare.com/turnstile/v0/siteverify", url.Values{
		"secret":   {secret},
		"response": {token},
		"remoteip": {clientIP},
	})
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	var res TurnstileResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return false
	}

	return res.Success
}
