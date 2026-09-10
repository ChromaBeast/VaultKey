package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type BrevoAPIService struct {
	APIKey    string
	FromEmail string
	FromName  string
}

type brevoRecipient struct {
	Email string `json:"email"`
}

type brevoSender struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type brevoPayload struct {
	Sender      brevoSender      `json:"sender"`
	To          []brevoRecipient `json:"to"`
	Subject     string           `json:"subject"`
	HTMLContent string           `json:"htmlContent"`
	TextContent string           `json:"textContent"`
}

func (b *BrevoAPIService) SendOTP(toEmail, otpCode string) error {
	payload := brevoPayload{
		Sender: brevoSender{
			Name:  b.FromName,
			Email: b.FromEmail,
		},
		To: []brevoRecipient{
			{Email: toEmail},
		},
		Subject: fmt.Sprintf("Your VaultKey Verification Code: %s", otpCode),
		TextContent: fmt.Sprintf(
			"Your 6-digit VaultKey verification code is: %s\n\n"+
				"This code will expire in 10 minutes.\n"+
				"If you did not request this code, your vault remains safely encrypted.\n",
			otpCode,
		),
		HTMLContent: fmt.Sprintf(`
			<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; background: #0b0e14; color: #f4f7fa; padding: 32px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
				<h2 style="margin-top: 0; color: #73e6ff; font-size: 20px;">VaultKey Password Reset</h2>
				<p style="color: #9aa6b5; font-size: 14px; line-height: 1.5;">Enter the following 6-digit verification code to reset your master password. This code will expire in 10 minutes.</p>
				<div style="background: #121824; border: 1px solid rgba(115,230,255,0.3); border-radius: 8px; text-align: center; padding: 18px; margin: 24px 0;">
					<span style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #ffffff;">%s</span>
				</div>
				<p style="color: #667384; font-size: 12px; line-height: 1.5; margin-bottom: 0;">If you did not request a password reset, no action is needed. Your vault remains safely encrypted.</p>
			</div>
		`, otpCode),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal brevo request: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("failed to create http request: %w", err)
	}

	req.Header.Set("accept", "application/json")
	req.Header.Set("api-key", b.APIKey)
	req.Header.Set("content-type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("brevo api request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("brevo api error (status %d): %s", resp.StatusCode, string(respBody))
	}

	return nil
}
