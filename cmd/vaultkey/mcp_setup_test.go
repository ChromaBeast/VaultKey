package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestNormalizeAgent(t *testing.T) {
	cases := []struct {
		input    string
		expected string
		ok       bool
	}{
		{"claude", "claude", true},
		{"claude-code", "claude", true},
		{"ClaudeCode", "claude", true},
		{"CURSOR", "cursor", true},
		{"codex", "codex", true},
		{"codex-cli", "codex", true},
		{"windsurf", "windsurf", true},
		{"codeium", "windsurf", true},
		{"antigravity", "antigravity", true},
		{"gemini", "antigravity", true},
		{"unknown-agent", "", false},
	}

	for _, c := range cases {
		canon, ok := normalizeAgent(c.input)
		if ok != c.ok {
			t.Errorf("normalizeAgent(%q) ok = %v, expected %v", c.input, ok, c.ok)
		}
		if canon != c.expected {
			t.Errorf("normalizeAgent(%q) = %q, expected %q", c.input, canon, c.expected)
		}
	}
}

func TestGenerateJSONSnippet(t *testing.T) {
	snippet, err := generateJSONSnippet("https://vault.example.com", "vk_test_123")
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}

	var parsed map[string]any
	if err := json.Unmarshal([]byte(snippet), &parsed); err != nil {
		t.Fatalf("snippet is not valid JSON: %v", err)
	}

	servers, ok := parsed["mcpServers"].(map[string]any)
	if !ok {
		t.Fatalf("expected mcpServers object")
	}

	vk, ok := servers["vaultkey"].(map[string]any)
	if !ok {
		t.Fatalf("expected vaultkey entry")
	}

	if vk["command"] != "vaultkey" {
		t.Errorf("expected command 'vaultkey', got %v", vk["command"])
	}

	envMap, ok := vk["env"].(map[string]any)
	if !ok {
		t.Fatalf("expected env map")
	}

	if envMap["VAULTKEY_SERVER"] != "https://vault.example.com" {
		t.Errorf("expected server URL, got %v", envMap["VAULTKEY_SERVER"])
	}
	if envMap["VAULTKEY_TOKEN"] != "vk_test_123" {
		t.Errorf("expected token, got %v", envMap["VAULTKEY_TOKEN"])
	}
}

func TestGenerateTomlSnippet(t *testing.T) {
	snippet := generateTomlSnippet("https://vault.example.com", "vk_test_456")
	if !strings.Contains(snippet, "[mcp_servers.vaultkey]") {
		t.Errorf("missing [mcp_servers.vaultkey]")
	}
	if !strings.Contains(snippet, `VAULTKEY_TOKEN = "vk_test_456"`) {
		t.Errorf("missing VAULTKEY_TOKEN")
	}
	if !strings.Contains(snippet, `VAULTKEY_SERVER = "https://vault.example.com"`) {
		t.Errorf("missing VAULTKEY_SERVER")
	}
}

func TestInstallJSONConfig(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "vaultkey_json_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	targetPath := filepath.Join(tmpDir, ".cursor", "mcp.json")

	// 1. Install fresh into non-existent file
	if err := installJSONConfig(targetPath, "http://localhost:8080", "tok_one"); err != nil {
		t.Fatalf("failed to install fresh JSON config: %v", err)
	}

	data, err := os.ReadFile(targetPath)
	if err != nil {
		t.Fatalf("file not created: %v", err)
	}
	if !strings.Contains(string(data), "tok_one") {
		t.Errorf("expected tok_one in file, got %s", string(data))
	}

	// 2. Existing file with other MCP servers should be preserved
	var parsed map[string]any
	_ = json.Unmarshal(data, &parsed)
	mcpServers := parsed["mcpServers"].(map[string]any)
	mcpServers["other-server"] = map[string]any{"command": "other"}
	updatedData, _ := json.MarshalIndent(parsed, "", "  ")
	_ = os.WriteFile(targetPath, updatedData, 0644)

	// Update vaultkey with new token
	if err := installJSONConfig(targetPath, "http://localhost:8080", "tok_two"); err != nil {
		t.Fatalf("failed to update existing JSON config: %v", err)
	}

	data2, _ := os.ReadFile(targetPath)
	content2 := string(data2)
	if !strings.Contains(content2, "other-server") {
		t.Errorf("expected other-server to be preserved, got %s", content2)
	}
	if !strings.Contains(content2, "tok_two") {
		t.Errorf("expected tok_two in file, got %s", content2)
	}
}

func TestInstallTomlConfig(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "vaultkey_toml_test_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	targetPath := filepath.Join(tmpDir, ".codex", "config.toml")
	snippet := generateTomlSnippet("http://localhost:8080", "tok_codex")

	// 1. Fresh install
	if err := installTomlConfig(targetPath, snippet); err != nil {
		t.Fatalf("failed to install fresh toml config: %v", err)
	}

	data, err := os.ReadFile(targetPath)
	if err != nil {
		t.Fatalf("file not created: %v", err)
	}
	if !strings.Contains(string(data), "[mcp_servers.vaultkey]") {
		t.Errorf("expected [mcp_servers.vaultkey], got %s", string(data))
	}

	// 2. Re-install with NEW token should update in-place without duplicating section
	snippet2 := generateTomlSnippet("https://new.vault.net", "tok_updated_456")
	if err := installTomlConfig(targetPath, snippet2); err != nil {
		t.Fatalf("update re-install failed: %v", err)
	}
	data2, _ := os.ReadFile(targetPath)
	content2 := string(data2)
	count := strings.Count(content2, "[mcp_servers.vaultkey]")
	if count != 1 {
		t.Errorf("expected exactly 1 [mcp_servers.vaultkey], got %d", count)
	}
	if !strings.Contains(content2, "tok_updated_456") {
		t.Errorf("expected updated token in file, got: %s", content2)
	}
	if strings.Contains(content2, "tok_codex") {
		t.Errorf("expected old token to be replaced, but still found in: %s", content2)
	}
}

func TestReplaceTomlSectionWithSurroundingContent(t *testing.T) {
	initial := `model = "claude-3-opus"

[mcp_servers.vaultkey]
command = "vaultkey"
args = ["mcp"]

[mcp_servers.vaultkey.env]
VAULTKEY_SERVER = "http://old-server"
VAULTKEY_TOKEN = "old-tok"

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
`
	newSnippet := generateTomlSnippet("http://new-server:8080", "new-tok-999")
	updated := replaceTomlSection(initial, newSnippet)

	if !strings.Contains(updated, `model = "claude-3-opus"`) {
		t.Errorf("expected preceding config to be preserved")
	}
	if !strings.Contains(updated, `[mcp_servers.github]`) {
		t.Errorf("expected subsequent config to be preserved")
	}
	if !strings.Contains(updated, "new-tok-999") {
		t.Errorf("expected new token")
	}
	if strings.Contains(updated, "old-tok") {
		t.Errorf("expected old token to be gone")
	}
	if strings.Count(updated, "[mcp_servers.vaultkey]") != 1 {
		t.Errorf("expected 1 vaultkey section, got %d", strings.Count(updated, "[mcp_servers.vaultkey]"))
	}
}

func TestAgentPathResolution(t *testing.T) {
	// Codex, Antigravity, and Windsurf should have empty LocalPath so they default to GlobalPath
	if supportedAgents["antigravity"].LocalPath != "" {
		t.Errorf("expected antigravity LocalPath to be empty, got %q", supportedAgents["antigravity"].LocalPath)
	}
	if supportedAgents["windsurf"].LocalPath != "" {
		t.Errorf("expected windsurf LocalPath to be empty, got %q", supportedAgents["windsurf"].LocalPath)
	}
	if supportedAgents["codex"].LocalPath != "" {
		t.Errorf("expected codex LocalPath to be empty, got %q", supportedAgents["codex"].LocalPath)
	}

	// Claude and Cursor should have local project workspace defaults
	if supportedAgents["claude"].LocalPath != ".mcp.json" {
		t.Errorf("expected claude LocalPath to be .mcp.json, got %q", supportedAgents["claude"].LocalPath)
	}
	if supportedAgents["cursor"].LocalPath != ".cursor/mcp.json" {
		t.Errorf("expected cursor LocalPath to be .cursor/mcp.json, got %q", supportedAgents["cursor"].LocalPath)
	}
}
