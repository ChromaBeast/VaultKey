package config

import (
	"os"
	"strings"
	"testing"
)

func TestConfigAllowedOriginsFromDomain(t *testing.T) {
	os.Setenv("VAULTKEY_DOMAIN", "vaultkey.sheershjaiswal.in")
	os.Unsetenv("VAULTKEY_ALLOWED_ORIGINS")
	defer func() {
		os.Unsetenv("VAULTKEY_DOMAIN")
		os.Unsetenv("VAULTKEY_ALLOWED_ORIGINS")
	}()

	cfg := Default()
	if err := applyEnv(cfg); err != nil {
		t.Fatalf("applyEnv failed: %v", err)
	}

	if !strings.Contains(cfg.AllowedOrigins, "https://vaultkey.sheershjaiswal.in") {
		t.Fatalf("expected AllowedOrigins to include https://vaultkey.sheershjaiswal.in, got %q", cfg.AllowedOrigins)
	}
}

func TestConfigExplicitAllowedOriginsOverride(t *testing.T) {
	os.Setenv("VAULTKEY_DOMAIN", "vaultkey.sheershjaiswal.in")
	os.Setenv("VAULTKEY_ALLOWED_ORIGINS", "https://custom.app.com")
	defer func() {
		os.Unsetenv("VAULTKEY_DOMAIN")
		os.Unsetenv("VAULTKEY_ALLOWED_ORIGINS")
	}()

	cfg := Default()
	if err := applyEnv(cfg); err != nil {
		t.Fatalf("applyEnv failed: %v", err)
	}

	if cfg.AllowedOrigins != "https://custom.app.com" {
		t.Fatalf("expected explicit AllowedOrigins override, got %q", cfg.AllowedOrigins)
	}
}
