package config

import (
	"fmt"
	"os"
)

type EmailConfig struct {
	Provider    string `yaml:"provider"`
	FromEmail   string `yaml:"from_email"`
	FromName    string `yaml:"from_name"`
	BrevoAPIKey string `yaml:"brevo_api_key"`
	SMTPHost    string `yaml:"smtp_host"`
	SMTPPort    int    `yaml:"smtp_port"`
	SMTPUser    string `yaml:"smtp_user"`
	SMTPPass    string `yaml:"smtp_pass"`
}

func DefaultEmailConfig() EmailConfig {
	return EmailConfig{
		Provider:  "console",
		FromEmail: "auth@vaultkey.dev",
		FromName:  "VaultKey Security",
		SMTPHost:  "smtp-relay.brevo.com",
		SMTPPort:  587,
	}
}

func ApplyEmailEnv(cfg *EmailConfig) {
	if v := os.Getenv("EMAIL_PROVIDER"); v != "" {
		cfg.Provider = v
	}
	if v := os.Getenv("EMAIL_FROM"); v != "" {
		cfg.FromEmail = v
	}
	if v := os.Getenv("EMAIL_FROM_NAME"); v != "" {
		cfg.FromName = v
	}
	if v := os.Getenv("BREVO_API_KEY"); v != "" {
		cfg.BrevoAPIKey = v
	}
	if v := os.Getenv("SMTP_HOST"); v != "" {
		cfg.SMTPHost = v
	}
	if v := os.Getenv("SMTP_PORT"); v != "" {
		var p int
		if _, err := fmt.Sscanf(v, "%d", &p); err == nil && p > 0 {
			cfg.SMTPPort = p
		}
	}
	if v := os.Getenv("SMTP_USER"); v != "" {
		cfg.SMTPUser = v
	}
	if v := os.Getenv("SMTP_PASS"); v != "" {
		cfg.SMTPPass = v
	}
	if cfg.BrevoAPIKey != "" && (cfg.Provider == "" || cfg.Provider == "console") {
		cfg.Provider = "brevo"
	}
}
