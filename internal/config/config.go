package config

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"gopkg.in/yaml.v3"
)

const (
	envDev        = "dev"
	testTurnstile = "1x0000000000000000000000000000000AA"
	demoRzpKey    = "rzp_test_vaultkey_demo"
	demoRzpSecret = "razorpay_secret_vaultkey_demo"
	defaultHMAC   = "vaultkey-default-audit-signing-hmac-key-1234567890"
	prodHMACHint  = "prod-change-me-vaultkey-hmac"
)

type Config struct {
	Port                  int    `yaml:"port"`
	DatabasePath          string `yaml:"database_path"`
	AutoLockDuration      string `yaml:"auto_lock_duration"`
	AuditSigningKey       string `yaml:"audit_signing_key"`
	RazorpayKeyID         string `yaml:"razorpay_key_id"`
	RazorpayKeySecret     string `yaml:"razorpay_key_secret"`
	RazorpayWebhookSecret string `yaml:"razorpay_webhook_secret"`
	RazorpayPlanProID     string `yaml:"razorpay_plan_pro_id"`
	RazorpayPlanEntID     string `yaml:"razorpay_plan_enterprise_id"`
	AllowedOrigins        string `yaml:"allowed_origins"`
	TurnstileSecretKey    string `yaml:"turnstile_secret_key"`
	TrustedProxies        string `yaml:"trusted_proxies"`
	MaxLoginAttempts      int    `yaml:"max_login_attempts"`
	LockoutDuration       string `yaml:"lockout_duration"`

	Environment string `yaml:"-"`
}

func Default() *Config {
	return &Config{
		Port:               8080,
		DatabasePath:       "vaultkey.db",
		AutoLockDuration:   "30m",
		AuditSigningKey:    defaultHMAC,
		RazorpayKeyID:      demoRzpKey,
		RazorpayKeySecret:  demoRzpSecret,
		RazorpayPlanProID:  "plan_pro_monthly_1499",
		RazorpayPlanEntID:  "plan_enterprise_monthly_4999",
		AllowedOrigins:     "http://localhost:8080,http://localhost:3000,http://localhost:5173",
		TurnstileSecretKey: testTurnstile,
		MaxLoginAttempts:   5,
		LockoutDuration:    "5m",
		Environment:        "production",
	}
}

func (c *Config) IsDev() bool {
	return c.Environment == envDev
}

func (c *Config) AutoLock() time.Duration {
	d, err := time.ParseDuration(c.AutoLockDuration)
	if err != nil || d <= 0 {
		return 30 * time.Minute
	}
	return d
}

func (c *Config) Lockout() time.Duration {
	d, err := time.ParseDuration(c.LockoutDuration)
	if err != nil || d <= 0 {
		return 5 * time.Minute
	}
	return d
}

func (c *Config) Validate() error {
	if c.IsDev() {
		return nil
	}
	if c.AuditSigningKey == defaultHMAC || c.AuditSigningKey == prodHMACHint || len(c.AuditSigningKey) < 32 {
		return fmt.Errorf("refusing to start in production with a default or weak audit signing key; set VAULTKEY_HMAC_KEY (64+ random chars) or audit_signing_key in vaultkey.yaml")
	}
	return nil
}

func Load(path string) (*Config, error) {
	cfg := Default()

	if path == "" {
		path = "vaultkey.yaml"
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			_ = Save(path, cfg)
			return cfg, applyEnv(cfg)
		}
		return nil, err
	}

	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, err
	}

	if err := applyEnv(cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}

func applyEnv(cfg *Config) error {
	cfg.Environment = os.Getenv("VAULTKEY_ENV")
	if cfg.Environment == "" {
		cfg.Environment = "production"
	}

	if p := os.Getenv("VAULTKEY_PORT"); p != "" {
		var port int
		if _, err := fmt.Sscanf(p, "%d", &port); err != nil || port <= 0 || port > 65535 {
			return fmt.Errorf("invalid VAULTKEY_PORT %q", p)
		}
		cfg.Port = port
	}
	if v := os.Getenv("VAULTKEY_DB_PATH"); v != "" {
		cfg.DatabasePath = v
	}
	if v := os.Getenv("VAULTKEY_AUTO_LOCK"); v != "" {
		cfg.AutoLockDuration = v
	}
	if v := os.Getenv("VAULTKEY_HMAC_KEY"); v != "" {
		cfg.AuditSigningKey = v
	} else if v := os.Getenv("VAULTKEY_AUDIT_SIGNING_KEY"); v != "" {
		cfg.AuditSigningKey = v
	}
	if v := os.Getenv("RAZORPAY_KEY_ID"); v != "" {
		cfg.RazorpayKeyID = v
	}
	if v := os.Getenv("RAZORPAY_KEY_SECRET"); v != "" {
		cfg.RazorpayKeySecret = v
	}
	if v := os.Getenv("RAZORPAY_WEBHOOK_SECRET"); v != "" {
		cfg.RazorpayWebhookSecret = v
	}
	if v := os.Getenv("RAZORPAY_PLAN_PRO_ID"); v != "" {
		cfg.RazorpayPlanProID = v
	}
	if v := os.Getenv("RAZORPAY_PLAN_ENTERPRISE_ID"); v != "" {
		cfg.RazorpayPlanEntID = v
	}
	if v := os.Getenv("VAULTKEY_ALLOWED_ORIGINS"); v != "" {
		cfg.AllowedOrigins = v
	} else if d := os.Getenv("VAULTKEY_DOMAIN"); d != "" && d != "localhost" {
		cfg.AllowedOrigins = cfg.AllowedOrigins + ",https://" + d
	}
	if v := os.Getenv("VAULTKEY_TURNSTILE_SECRET_KEY"); v != "" {
		cfg.TurnstileSecretKey = v
	}
	if v := os.Getenv("VAULTKEY_TRUSTED_PROXIES"); v != "" {
		cfg.TrustedProxies = v
	}
	return nil
}

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
