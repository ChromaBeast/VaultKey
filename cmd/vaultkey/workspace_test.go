package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFindWorkspaceConfigFile(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "vaultkey_ws_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	subDir := filepath.Join(tmpDir, "src", "services", "auth")
	if err := os.MkdirAll(subDir, 0755); err != nil {
		t.Fatalf("failed to create subDir: %v", err)
	}

	// 1. When no config exists
	_, err = FindWorkspaceConfigFile(subDir)
	if err == nil {
		t.Fatalf("expected error when no config file exists")
	}

	// 2. Put vaultkey.yaml at tmpDir
	plainPath := filepath.Join(tmpDir, "vaultkey.yaml")
	if err := os.WriteFile(plainPath, []byte("project: plain-proj\nenv: staging\n"), 0644); err != nil {
		t.Fatalf("failed to write vaultkey.yaml: %v", err)
	}

	found, err := FindWorkspaceConfigFile(subDir)
	if err != nil {
		t.Fatalf("expected to find vaultkey.yaml, got err: %v", err)
	}
	if found != plainPath {
		t.Fatalf("expected %s, got %s", plainPath, found)
	}

	// 3. Put .vaultkey.yaml at subDir (should take precedence)
	dotPath := filepath.Join(subDir, ".vaultkey.yaml")
	if err := os.WriteFile(dotPath, []byte("project: dot-proj\nenv: development\n"), 0644); err != nil {
		t.Fatalf("failed to write .vaultkey.yaml: %v", err)
	}

	found2, err := FindWorkspaceConfigFile(subDir)
	if err != nil {
		t.Fatalf("expected to find .vaultkey.yaml, got err: %v", err)
	}
	if found2 != dotPath {
		t.Fatalf("expected %s to take precedence, got %s", dotPath, found2)
	}
}

func TestLoadWorkspaceConfigFallback(t *testing.T) {
	// In an isolated dir with no config
	tmpDir, err := os.MkdirTemp("", "vaultkey_ws_isolated_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	// Switch working dir temporarily
	origWd, _ := os.Getwd()
	defer os.Chdir(origWd)
	_ = os.Chdir(tmpDir)

	cfg := LoadWorkspaceConfig()
	if cfg.Project != "default" {
		t.Fatalf("expected default project, got %q", cfg.Project)
	}
	if cfg.Env != "production" {
		t.Fatalf("expected production env, got %q", cfg.Env)
	}

	// Now create a .vaultkey.yaml with aliases
	yamlContent := `
project: payment-svc
environment: local-test
server: http://127.0.0.1:9090
`
	if err := os.WriteFile(filepath.Join(tmpDir, ".vaultkey.yaml"), []byte(yamlContent), 0644); err != nil {
		t.Fatalf("failed to write .vaultkey.yaml: %v", err)
	}

	cfg2 := LoadWorkspaceConfig()
	if cfg2.Project != "payment-svc" {
		t.Fatalf("expected 'payment-svc', got %q", cfg2.Project)
	}
	if cfg2.Env != "local-test" {
		t.Fatalf("expected 'local-test', got %q", cfg2.Env)
	}
	if cfg2.Server != "http://127.0.0.1:9090" {
		t.Fatalf("expected 'http://127.0.0.1:9090', got %q", cfg2.Server)
	}
}

func TestCheckGitIgnore(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "vaultkey_gi_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	envFile := filepath.Join(tmpDir, ".env")
	_ = os.WriteFile(envFile, []byte("SECRET=1\n"), 0600)

	// Initially not ignored
	ignored, err := CheckGitIgnore(envFile)
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if ignored {
		t.Fatalf("expected .env to NOT be ignored yet")
	}

	// Add .gitignore with .env
	giPath := filepath.Join(tmpDir, ".gitignore")
	if err := os.WriteFile(giPath, []byte("# comment\n.env\n"), 0644); err != nil {
		t.Fatalf("failed to write .gitignore: %v", err)
	}

	ignored2, err := CheckGitIgnore(envFile)
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if !ignored2 {
		t.Fatalf("expected .env to be ignored after adding to .gitignore")
	}

	// Test wildcard in .gitignore
	subDir := filepath.Join(tmpDir, "nested")
	_ = os.MkdirAll(subDir, 0755)
	nestedFile := filepath.Join(subDir, "secrets.env")
	_ = os.WriteFile(nestedFile, []byte("FOO=BAR\n"), 0600)

	if err := os.WriteFile(giPath, []byte("*.env\n"), 0644); err != nil {
		t.Fatalf("failed to write .gitignore: %v", err)
	}

	ignored3, _ := CheckGitIgnore(nestedFile)
	if !ignored3 {
		t.Fatalf("expected nested/secrets.env to match *.env wildcard")
	}

	// Test slash-pattern in .gitignore (e.g. nested/specific.env)
	specificFile := filepath.Join(subDir, "specific.txt")
	_ = os.WriteFile(specificFile, []byte("VAL=1\n"), 0600)
	if err := os.WriteFile(giPath, []byte("nested/specific.txt\n"), 0644); err != nil {
		t.Fatalf("failed to write .gitignore: %v", err)
	}

	ignoredSlash, _ := CheckGitIgnore(specificFile)
	if !ignoredSlash {
		t.Fatalf("expected nested/specific.txt to match nested/specific.txt slash pattern")
	}

	// Test in this repository with native git
	repoRoot, err := filepath.Abs("../..")
	if err == nil {
		repoEnvFile := filepath.Join(repoRoot, ".env")
		repoIgnored, err := CheckGitIgnore(repoEnvFile)
		if err == nil && !repoIgnored {
			t.Errorf("expected %s to be ignored by repository gitignore", repoEnvFile)
		}

		repoNormalFile := filepath.Join(repoRoot, "cmd", "vaultkey", "main.go")
		normalIgnored, err := CheckGitIgnore(repoNormalFile)
		if err == nil && normalIgnored {
			t.Errorf("expected %s to NOT be ignored by repository gitignore", repoNormalFile)
		}
	}
}
