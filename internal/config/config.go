package config

import (
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

// Config represents the application settings.
type Config struct {
	Port                 int    `yaml:"port"`
	DatabasePath         string `yaml:"database_path"`
	AutoLockDuration     string `yaml:"auto_lock_duration"`
	AuditSigningKey      string `yaml:"audit_signing_key"`
	RazorpayKeyID        string `yaml:"razorpay_key_id"`
	RazorpayKeySecret    string `yaml:"razorpay_key_secret"`
	RazorpayWebhookSecret string `yaml:"razorpay_webhook_secret"`
}

// Default returns a Config populated with default values.
func Default() *Config {
	return &Config{
		Port:                  8080,
		DatabasePath:          "vaultkey.db",
		AutoLockDuration:      "30m",
		AuditSigningKey:       "vaultkey-default-audit-signing-hmac-key-1234567890",
		RazorpayKeyID:         "rzp_test_vaultkey_demo",
		RazorpayKeySecret:     "razorpay_secret_vaultkey_demo",
		RazorpayWebhookSecret: "razorpay_webhook_secret_demo",
	}
}

// Load loads the configuration from a file, falling back to defaults if not found.
func Load(path string) (*Config, error) {
	cfg := Default()

	if path == "" {
		path = "vaultkey.yaml"
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			// If file does not exist, save the default config for user convenience
			_ = Save(path, cfg)
			return cfg, nil
		}
		return nil, err
	}

	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, err
	}

	// Environment variable overrides
	if envDb := os.Getenv("VAULTKEY_DB_PATH"); envDb != "" {
		cfg.DatabasePath = envDb
	}
	if envLock := os.Getenv("VAULTKEY_AUTO_LOCK"); envLock != "" {
		cfg.AutoLockDuration = envLock
	}
	if envSigning := os.Getenv("VAULTKEY_AUDIT_SIGNING_KEY"); envSigning != "" {
		cfg.AuditSigningKey = envSigning
	}
	if rzpKey := os.Getenv("RAZORPAY_KEY_ID"); rzpKey != "" {
		cfg.RazorpayKeyID = rzpKey
	}
	if rzpSecret := os.Getenv("RAZORPAY_KEY_SECRET"); rzpSecret != "" {
		cfg.RazorpayKeySecret = rzpSecret
	}
	if rzpWebhook := os.Getenv("RAZORPAY_WEBHOOK_SECRET"); rzpWebhook != "" {
		cfg.RazorpayWebhookSecret = rzpWebhook
	}


	return cfg, nil
}

// Save writes the configuration to a file.
func Save(path string, cfg *Config) error {
	data, err := yaml.Marshal(cfg)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}
	return os.WriteFile(path, data, 0600)
}
