package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type AgentConfig struct {
	Name        string
	LocalPath   string
	GlobalPath  string
	Format      string // "json" or "toml"
	Description string
	CliHint     string
}

var supportedAgents = map[string]AgentConfig{
	"claude": {
		Name:        "Claude Code",
		LocalPath:   ".mcp.json",
		GlobalPath:  "~/.claude.json",
		Format:      "json",
		Description: "Anthropic Claude Code CLI & Claude Desktop",
		CliHint:     "claude mcp add --env VAULTKEY_SERVER=%s --env VAULTKEY_TOKEN=%s vaultkey -- vaultkey mcp",
	},
	"cursor": {
		Name:        "Cursor",
		LocalPath:   ".cursor/mcp.json",
		GlobalPath:  "~/.cursor/mcp.json",
		Format:      "json",
		Description: "Cursor AI Code Editor",
	},
	"codex": {
		Name:        "Codex CLI",
		LocalPath:   "",
		GlobalPath:  "~/.codex/config.toml",
		Format:      "toml",
		Description: "Codex CLI & Automation Agent",
	},
	"windsurf": {
		Name:        "Windsurf",
		LocalPath:   "",
		GlobalPath:  "~/.codeium/windsurf/mcp_config.json",
		Format:      "json",
		Description: "Codeium Windsurf IDE",
	},
	"antigravity": {
		Name:        "Antigravity",
		LocalPath:   "",
		GlobalPath:  "~/.gemini/antigravity/mcp_config.json",
		Format:      "json",
		Description: "Google DeepMind Antigravity Pair-Programming Agent",
	},
}

// normalizeAgent maps aliases to canonical agent keys.
func normalizeAgent(raw string) (string, bool) {
	key := strings.ToLower(strings.TrimSpace(raw))
	switch key {
	case "claude", "claude-code", "claudecode", "claudedesktop":
		return "claude", true
	case "cursor":
		return "cursor", true
	case "codex", "codex-cli":
		return "codex", true
	case "windsurf", "codeium":
		return "windsurf", true
	case "antigravity", "gemini":
		return "antigravity", true
	case "all":
		return "all", true
	}
	return "", false
}

func handleMCPCommand() error {
	if len(os.Args) >= 3 {
		sub := os.Args[2]
		switch sub {
		case "setup", "init":
			return handleMCPSetup(os.Args[3:])
		case "-h", "--help", "help":
			printMCPUsage()
			return nil
		}
	}

	// Default behavior: start stdio MCP server for agent connections
	return handleMCP()
}

func printMCPUsage() {
	fmt.Print(`VaultKey MCP Server & AI Agent Setup

Usage:
  vaultkey mcp                              Start stdio MCP server for AI clients
  vaultkey mcp setup <agent> [options]      Generate or install MCP configuration
  vaultkey mcp init <agent> [options]       Alias for setup

Supported Agents:
  claude       Claude Code CLI (.mcp.json or ~/.claude.json)
  cursor       Cursor IDE (.cursor/mcp.json or ~/.cursor/mcp.json)
  codex        Codex CLI (~/.codex/config.toml)
  windsurf     Windsurf IDE (~/.codeium/windsurf/mcp_config.json)
  antigravity  Antigravity IDE (~/.gemini/antigravity/mcp_config.json)

Options:
  --write, -w   Install configuration directly into the target configuration file
  --global, -g  Target user-wide global config instead of project workspace
  --server      VaultKey server address (default: VAULTKEY_SERVER or http://localhost:8080)
  --token       VaultKey API token (default: VAULTKEY_TOKEN or YOUR_VAULTKEY_TOKEN)
  --json        Output raw JSON snippet only
`)
}

func handleMCPSetup(args []string) error {
	fs := flag.NewFlagSet("mcp setup", flag.ContinueOnError)
	fs.Usage = printMCPUsage

	writeOpt := fs.Bool("write", false, "write configuration directly to agent config file")
	fs.BoolVar(writeOpt, "w", false, "shorthand for --write")

	globalOpt := fs.Bool("global", false, "target global user configuration path instead of local workspace")
	fs.BoolVar(globalOpt, "g", false, "shorthand for --global")

	defaultServer := os.Getenv("VAULTKEY_SERVER")
	if defaultServer == "" {
		defaultServer = "http://localhost:8080"
	}
	serverOpt := fs.String("server", defaultServer, "VaultKey server URL")
	fs.StringVar(serverOpt, "s", defaultServer, "shorthand for --server")

	defaultToken := os.Getenv("VAULTKEY_TOKEN")
	if defaultToken == "" {
		defaultToken = "YOUR_VAULTKEY_TOKEN"
	}
	tokenOpt := fs.String("token", defaultToken, "VaultKey API token")
	fs.StringVar(tokenOpt, "t", defaultToken, "shorthand for --token")
	jsonOnly := fs.Bool("json", false, "print raw JSON snippet only")

	// Separate agent name from flag arguments so flags can appear before or after the agent name
	var flagArgs []string
	var agentName string

	for i := 0; i < len(args); i++ {
		arg := args[i]
		if strings.HasPrefix(arg, "-") {
			flagArgs = append(flagArgs, arg)
			cleanArg := strings.TrimLeft(arg, "-")
			// If flag takes a value separated by space: -server, --server, -s, -token, --token, -t
			if (cleanArg == "server" || cleanArg == "s" || cleanArg == "token" || cleanArg == "t") &&
				!strings.Contains(arg, "=") && i+1 < len(args) && !strings.HasPrefix(args[i+1], "-") {
				i++
				flagArgs = append(flagArgs, args[i])
			}
		} else if agentName == "" {
			agentName = arg
		} else {
			flagArgs = append(flagArgs, arg)
		}
	}

	if err := fs.Parse(flagArgs); err != nil {
		return err
	}

	if agentName == "" {
		printMCPUsage()
		return fmt.Errorf("missing agent name (e.g., claude, cursor, codex, windsurf, antigravity, all)")
	}

	canon, ok := normalizeAgent(agentName)
	if !ok {
		return fmt.Errorf("unknown agent %q. Supported agents: claude, cursor, codex, windsurf, antigravity, all", agentName)
	}

	serverURL := strings.TrimRight(*serverOpt, "/")
	token := *tokenOpt

	var agentsToSetup []string
	if canon == "all" {
		agentsToSetup = []string{"claude", "cursor", "codex", "windsurf", "antigravity"}
	} else {
		agentsToSetup = []string{canon}
	}

	if *jsonOnly {
		snippet, err := generateJSONSnippet(serverURL, token)
		if err != nil {
			return err
		}
		fmt.Println(snippet)
		return nil
	}

	for _, aKey := range agentsToSetup {
		agent := supportedAgents[aKey]
		targetPath := agent.LocalPath
		if *globalOpt || agent.LocalPath == "" {
			targetPath = agent.GlobalPath
		}

		expandedPath, err := expandHomeDir(targetPath)
		if err != nil {
			return err
		}

		if agent.Format == "toml" {
			snippet := generateTomlSnippet(serverURL, token)
			if *writeOpt {
				if err := installTomlConfig(expandedPath, snippet); err != nil {
					return err
				}
			} else {
				printAgentSnippet(agent, targetPath, snippet, serverURL, token)
			}
		} else {
			snippet, err := generateJSONSnippet(serverURL, token)
			if err != nil {
				return err
			}
			if *writeOpt {
				if err := installJSONConfig(expandedPath, serverURL, token); err != nil {
					return err
				}
			} else {
				printAgentSnippet(agent, targetPath, snippet, serverURL, token)
			}
		}
	}

	return nil
}

func printAgentSnippet(agent AgentConfig, targetPath, snippet, server, token string) {
	fmt.Printf("\n=== VaultKey MCP Configuration for %s ===\n", agent.Name)
	fmt.Printf("Agent:       %s\n", agent.Description)
	fmt.Printf("Config File: %s\n\n", targetPath)

	if agent.CliHint != "" {
		fmt.Printf("Quick CLI Setup Command:\n")
		fmt.Printf("  \033[36m%s\033[0m\n\n", fmt.Sprintf(agent.CliHint, server, token))
		fmt.Printf("Or add to configuration file:\n")
	}

	fmt.Println(snippet)
	fmt.Printf("\n💡 To install directly, run with --write:\n")
	fmt.Printf("  \033[32mvaultkey mcp setup %s --write\033[0m\n\n", strings.ToLower(strings.Split(agent.Name, " ")[0]))
}

func generateJSONSnippet(server, token string) (string, error) {
	config := map[string]any{
		"mcpServers": map[string]any{
			"vaultkey": map[string]any{
				"command": "vaultkey",
				"args":    []string{"mcp"},
				"env": map[string]string{
					"VAULTKEY_SERVER": server,
					"VAULTKEY_TOKEN":  token,
				},
			},
		},
	}
	bytes, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

func generateTomlSnippet(server, token string) string {
	return fmt.Sprintf(`[mcp_servers.vaultkey]
command = "vaultkey"
args = ["mcp"]

[mcp_servers.vaultkey.env]
VAULTKEY_SERVER = "%s"
VAULTKEY_TOKEN = "%s"
`, server, token)
}

func expandHomeDir(path string) (string, error) {
	if !strings.HasPrefix(path, "~") {
		return path, nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to locate user home directory: %w", err)
	}
	if path == "~" {
		return home, nil
	}
	if strings.HasPrefix(path, "~/") {
		return filepath.Join(home, path[2:]), nil
	}
	return path, nil
}

func installJSONConfig(destPath, server, token string) error {
	dir := filepath.Dir(destPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory %s: %w", dir, err)
	}

	rootMap := make(map[string]any)
	if existingData, err := os.ReadFile(destPath); err == nil && len(strings.TrimSpace(string(existingData))) > 0 {
		_ = json.Unmarshal(existingData, &rootMap)
	}

	mcpServers, ok := rootMap["mcpServers"].(map[string]any)
	if !ok {
		mcpServers = make(map[string]any)
		rootMap["mcpServers"] = mcpServers
	}

	mcpServers["vaultkey"] = map[string]any{
		"command": "vaultkey",
		"args":    []string{"mcp"},
		"env": map[string]string{
			"VAULTKEY_SERVER": server,
			"VAULTKEY_TOKEN":  token,
		},
	}

	data, err := json.MarshalIndent(rootMap, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to encode JSON: %w", err)
	}
	data = append(data, '\n')

	if err := os.WriteFile(destPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write %s: %w", destPath, err)
	}

	fmt.Printf("✅ Successfully installed VaultKey MCP configuration into %s\n", destPath)
	return nil
}

func replaceTomlSection(content, snippet string) string {
	lines := strings.Split(content, "\n")
	var newLines []string
	inSection := false
	replaced := false

	snippetTrimmed := strings.TrimRight(snippet, "\n")
	snippetLines := strings.Split(snippetTrimmed, "\n")

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		if strings.HasPrefix(trimmed, "[mcp_servers.vaultkey") {
			if !inSection {
				inSection = true
				if !replaced {
					newLines = append(newLines, snippetLines...)
					replaced = true
				}
			}
			continue
		}

		if inSection {
			// A new top-level table or other section starts
			if strings.HasPrefix(trimmed, "[") && !strings.HasPrefix(trimmed, "[mcp_servers.vaultkey") {
				inSection = false
				newLines = append(newLines, line)
			}
			// Skip old lines belonging to vaultkey section
			continue
		}

		newLines = append(newLines, line)
	}

	if !replaced {
		if len(newLines) > 0 && strings.TrimSpace(newLines[len(newLines)-1]) != "" {
			newLines = append(newLines, "")
		}
		newLines = append(newLines, snippetLines...)
	}

	result := strings.Join(newLines, "\n")
	if !strings.HasSuffix(result, "\n") {
		result += "\n"
	}
	return result
}

func installTomlConfig(destPath, snippet string) error {
	dir := filepath.Dir(destPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory %s: %w", dir, err)
	}

	var newContent string
	existingData, err := os.ReadFile(destPath)
	if err == nil {
		newContent = replaceTomlSection(string(existingData), snippet)
	} else {
		newContent = snippet
		if !strings.HasSuffix(newContent, "\n") {
			newContent += "\n"
		}
	}

	if err := os.WriteFile(destPath, []byte(newContent), 0644); err != nil {
		return fmt.Errorf("failed to write %s: %w", destPath, err)
	}

	fmt.Printf("✅ Successfully installed VaultKey MCP configuration into %s\n", destPath)
	return nil
}
