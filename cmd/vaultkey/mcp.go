package main

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"vaultkey/internal/client"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// handleMCP starts the VaultKey MCP server over stdio.
// Agents (Claude, Cursor, Antigravity) connect to this via:
//
//	{ "command": "vaultkey", "args": ["mcp"] }
//
// Required env:
//
//	VAULTKEY_SERVER  – VaultKey API address (default http://localhost:8080)
//	VAULTKEY_TOKEN   – API token (create with: vaultkey keys create)
func handleMCP() error {
	c := client.NewClient()
	s := server.NewMCPServer(
		"VaultKey",
		"1.0.0",
		server.WithToolCapabilities(true),
	)

	// ── list_projects ─────────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("list_projects",
			mcp.WithDescription("List all projects visible to the current API token."),
			mcp.WithReadOnlyHintAnnotation(true),
		),
		func(_ context.Context, _ mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			projects, err := c.ListProjects()
			if err != nil {
				return toolErr("list projects: %v", err), nil
			}
			if len(projects) == 0 {
				return mcp.NewToolResultText("(no projects found)"), nil
			}
			return mcp.NewToolResultText(strings.Join(projects, "\n")), nil
		},
	)

	// ── list_secret_names ─────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("list_secret_names",
			mcp.WithDescription("List secret *names* (not values) for a project/environment."),
			mcp.WithString("project",
				mcp.Description("Project name (default: default)"),
				mcp.DefaultString("default"),
			),
			mcp.WithString("env",
				mcp.Description("Environment name (default: production)"),
				mcp.DefaultString("production"),
			),
			mcp.WithReadOnlyHintAnnotation(true),
		),
		func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			proj := mcp.ParseString(req, "project", "default")
			env := mcp.ParseString(req, "env", "production")

			headers, err := c.ListSecrets(proj, env)
			if err != nil {
				return toolErr("list secrets: %v", err), nil
			}
			if len(headers) == 0 {
				return mcp.NewToolResultText("(no secrets found)"), nil
			}
			names := make([]string, len(headers))
			for i, h := range headers {
				names[i] = h.Key
			}
			return mcp.NewToolResultText(strings.Join(names, "\n")), nil
		},
	)

	// ── check_missing_secrets ─────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("check_missing_secrets",
			mcp.WithDescription("Check which of the given secret names are missing in VaultKey. Returns only the missing names — safe to call since no values are revealed."),
			mcp.WithString("project",
				mcp.Description("Project name"),
				mcp.DefaultString("default"),
			),
			mcp.WithString("env",
				mcp.Description("Environment name"),
				mcp.DefaultString("production"),
			),
			mcp.WithArray("keys",
				mcp.Description("Secret names to check"),
				mcp.Required(),
			),
			mcp.WithReadOnlyHintAnnotation(true),
		),
		func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			proj := mcp.ParseString(req, "project", "default")
			env := mcp.ParseString(req, "env", "production")
			keysRaw := mcp.ParseArgument(req, "keys", nil)

			wanted := toStringSlice(keysRaw)
			if len(wanted) == 0 {
				return toolErr("keys array must not be empty"), nil
			}

			headers, err := c.ListSecrets(proj, env)
			if err != nil {
				return toolErr("list secrets: %v", err), nil
			}
			existing := make(map[string]bool, len(headers))
			for _, h := range headers {
				existing[h.Key] = true
			}

			var missing []string
			for _, k := range wanted {
				if !existing[k] {
					missing = append(missing, k)
				}
			}
			if len(missing) == 0 {
				return mcp.NewToolResultText("All secrets present."), nil
			}
			return mcp.NewToolResultText("Missing:\n" + strings.Join(missing, "\n")), nil
		},
	)

	// ── get_secret_value ──────────────────────────────────────────────────────
	// ⚠️  This returns the plaintext value into the LLM context.
	// Prefer run_with_secrets when you just need a process to have the value.
	s.AddTool(
		mcp.NewTool("get_secret_value",
			mcp.WithDescription("Retrieve the plaintext value of a single secret. WARNING: the value will be visible in the LLM context window. Use run_with_secrets when you only need a command to have access to it."),
			mcp.WithString("key",
				mcp.Description("Secret key name"),
				mcp.Required(),
			),
			mcp.WithString("project",
				mcp.Description("Project name"),
				mcp.DefaultString("default"),
			),
			mcp.WithString("env",
				mcp.Description("Environment name"),
				mcp.DefaultString("production"),
			),
		),
		func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			key := mcp.ParseString(req, "key", "")
			if key == "" {
				return toolErr("key is required"), nil
			}
			proj := mcp.ParseString(req, "project", "default")
			env := mcp.ParseString(req, "env", "production")

			value, err := c.GetSecret(proj, env, key)
			if err != nil {
				return toolErr("get secret: %v", err), nil
			}
			return mcp.NewToolResultText(value), nil
		},
	)

	// ── set_secret_value ──────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("set_secret_value",
			mcp.WithDescription("Create or update a secret in VaultKey."),
			mcp.WithString("key",
				mcp.Description("Secret key name"),
				mcp.Required(),
			),
			mcp.WithString("value",
				mcp.Description("Secret value"),
				mcp.Required(),
			),
			mcp.WithString("project",
				mcp.Description("Project name"),
				mcp.DefaultString("default"),
			),
			mcp.WithString("env",
				mcp.Description("Environment name"),
				mcp.DefaultString("production"),
			),
			mcp.WithDestructiveHintAnnotation(true),
		),
		func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			key := mcp.ParseString(req, "key", "")
			value := mcp.ParseString(req, "value", "")
			proj := mcp.ParseString(req, "project", "default")
			env := mcp.ParseString(req, "env", "production")

			if key == "" || value == "" {
				return toolErr("key and value are required"), nil
			}
			if err := c.SetSecret(proj, env, key, value); err != nil {
				return toolErr("set secret: %v", err), nil
			}
			return mcp.NewToolResultText(fmt.Sprintf("Secret %q set in %s/%s.", key, proj, env)), nil
		},
	)

	// ── run_with_secrets ──────────────────────────────────────────────────────
	// Crown-jewel tool: secrets are injected into the child process environment
	// but NEVER returned to the caller — only stdout/stderr are returned.
	s.AddTool(
		mcp.NewTool("run_with_secrets",
			mcp.WithDescription("Run a shell command with secrets from VaultKey injected as environment variables. The secret *values* are never returned — only the command's stdout and stderr are. This is the safest way to use secrets in an AI-assisted workflow."),
			mcp.WithString("command",
				mcp.Description("Shell command to execute (passed to sh -c)"),
				mcp.Required(),
			),
			mcp.WithString("project",
				mcp.Description("Project whose secrets to inject"),
				mcp.DefaultString("default"),
			),
			mcp.WithString("env",
				mcp.Description("Environment whose secrets to inject"),
				mcp.DefaultString("production"),
			),
			mcp.WithString("working_dir",
				mcp.Description("Working directory for the command (default: current directory)"),
			),
		),
		func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			command := mcp.ParseString(req, "command", "")
			if command == "" {
				return toolErr("command is required"), nil
			}
			proj := mcp.ParseString(req, "project", "default")
			env := mcp.ParseString(req, "env", "production")
			workDir := mcp.ParseString(req, "working_dir", "")

			secrets, err := c.BatchGetSecrets(proj, env)
			if err != nil {
				return toolErr("fetch secrets: %v", err), nil
			}

			envVars := os.Environ()
			for k, v := range secrets {
				envVars = append(envVars, k+"="+v)
			}

			cmd := exec.Command("sh", "-c", command)
			cmd.Env = envVars
			if workDir != "" {
				cmd.Dir = workDir
			}

			var stdout, stderr bytes.Buffer
			cmd.Stdout = &stdout
			cmd.Stderr = &stderr

			runErr := cmd.Run()

			var sb strings.Builder
			if stdout.Len() > 0 {
				sb.WriteString("stdout:\n")
				sb.WriteString(stdout.String())
			}
			if stderr.Len() > 0 {
				if sb.Len() > 0 {
					sb.WriteString("\n")
				}
				sb.WriteString("stderr:\n")
				sb.WriteString(stderr.String())
			}
			if runErr != nil {
				if sb.Len() > 0 {
					sb.WriteString("\n")
				}
				sb.WriteString(fmt.Sprintf("exit error: %v", runErr))
			}
			if sb.Len() == 0 {
				sb.WriteString("(command completed with no output)")
			}

			return mcp.NewToolResultText(sb.String()), nil
		},
	)

	return server.ServeStdio(s)
}

// toolErr returns an error-flagged CallToolResult without stopping the server.
func toolErr(format string, args ...any) *mcp.CallToolResult {
	result := mcp.NewToolResultText(fmt.Sprintf("error: "+format, args...))
	result.IsError = true
	return result
}

// toStringSlice coerces the value from ParseArgument into []string.
func toStringSlice(v any) []string {
	if v == nil {
		return nil
	}
	switch t := v.(type) {
	case []string:
		return t
	case []any:
		out := make([]string, 0, len(t))
		for _, item := range t {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	}
	return nil
}
