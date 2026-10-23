package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestInitWorkspace(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "vaultkey_init_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	origWd, _ := os.Getwd()
	defer os.Chdir(origWd)
	_ = os.Chdir(tmpDir)

	origArgs := os.Args
	defer func() { os.Args = origArgs }()

	// Run init with custom project and env
	os.Args = []string{"vaultkey", "init", "--project=test-api", "--env=staging"}
	if err := handleInit(); err != nil {
		t.Fatalf("handleInit failed: %v", err)
	}

	content, err := os.ReadFile(filepath.Join(tmpDir, ".vaultkey.yaml"))
	if err != nil {
		t.Fatalf("failed to read created .vaultkey.yaml: %v", err)
	}

	str := string(content)
	if !strings.Contains(str, "project: test-api") {
		t.Errorf("expected project: test-api, got: %s", str)
	}
	if !strings.Contains(str, "env: staging") {
		t.Errorf("expected env: staging, got: %s", str)
	}

	// Verify LoadWorkspaceConfig picks up these values automatically
	cfg := LoadWorkspaceConfig()
	if cfg.Project != "test-api" {
		t.Errorf("LoadWorkspaceConfig expected project test-api, got %s", cfg.Project)
	}
	if cfg.Env != "staging" {
		t.Errorf("LoadWorkspaceConfig expected env staging, got %s", cfg.Env)
	}

	// Re-running without --force should fail with descriptive error
	if err := handleInit(); err == nil {
		t.Errorf("expected error when .vaultkey.yaml already exists without --force")
	}

	// Re-running with --force should succeed
	os.Args = []string{"vaultkey", "init", "--project=new-proj", "--force"}
	if err := handleInit(); err != nil {
		t.Fatalf("handleInit with --force failed: %v", err)
	}

	cfgUpdated := LoadWorkspaceConfig()
	if cfgUpdated.Project != "new-proj" {
		t.Errorf("expected new-proj after overwrite, got %s", cfgUpdated.Project)
	}
}
