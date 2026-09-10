package email

import (
	"strings"
	"vaultkey/internal/config"
)

func NewService(cfg config.EmailConfig) Service {
	switch strings.ToLower(cfg.Provider) {
	case "brevo":
		if cfg.BrevoAPIKey != "" {
			return &BrevoAPIService{
				APIKey:    cfg.BrevoAPIKey,
				FromEmail: cfg.FromEmail,
				FromName:  cfg.FromName,
			}
		}
		return &SMTPService{
			Host:     cfg.SMTPHost,
			Port:     cfg.SMTPPort,
			Username: cfg.SMTPUser,
			Password: cfg.SMTPPass,
			From:     cfg.FromEmail,
		}
	case "smtp":
		return &SMTPService{
			Host:     cfg.SMTPHost,
			Port:     cfg.SMTPPort,
			Username: cfg.SMTPUser,
			Password: cfg.SMTPPass,
			From:     cfg.FromEmail,
		}
	default:
		return &ConsoleService{}
	}
}
