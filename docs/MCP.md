# VaultKey MCP Server

VaultKey ships a built-in [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. It lets AI coding agents (Claude Code, Cursor, Antigravity, etc.) work with your secrets securely — **without leaking plaintext values into the LLM context window**.

## How It Works

```
Agent ──stdio JSON-RPC──► vaultkey mcp ──HTTP──► VaultKey server
```

`vaultkey mcp` is a single-process, zero-dependency MCP server that reuses the same `VAULTKEY_TOKEN` API key your CLI uses. All secret access is logged in VaultKey's tamper-evident audit ledger.

---

## Prerequisites

1. **VaultKey server running** (local or remote).
2. **A machine API key** — create one with:
   ```sh
   vaultkey keys create --label "claude-code"
   # → vk_...
   ```
3. **`vaultkey` binary** in your `$PATH`.

---

## Client Configuration

### Claude Desktop / Claude Code

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "http://localhost:8080",
        "VAULTKEY_TOKEN": "vk_your_machine_key_here"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "http://localhost:8080",
        "VAULTKEY_TOKEN": "vk_your_machine_key_here"
      }
    }
  }
}
```

### Antigravity (this tool)

Add to `~/.gemini/antigravity/config/mcp.json`:

```json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "http://localhost:8080",
        "VAULTKEY_TOKEN": "vk_your_machine_key_here"
      }
    }
  }
}
```

---

## Available Tools

| Tool | Description | Returns secret values? |
|---|---|---|
| `list_projects` | List all visible projects | No |
| `list_secret_names` | List secret *names* for a project/env | No |
| `check_missing_secrets` | Which of given names are absent | No |
| `get_secret_value` | Retrieve a single secret's plaintext | **Yes** ⚠️ |
| `set_secret_value` | Create or update a secret | N/A |
| `run_with_secrets` | Run a command with secrets injected as env vars | **No** ✅ |

### `run_with_secrets` — The Crown Jewel

This is the safest way to use secrets in an AI-assisted workflow. The agent never sees the secret values — only the command's stdout/stderr is returned.

**Example agent prompt:**
> "Run the database migration using secrets from project `myapp`, env `production`."

The agent calls:
```json
{
  "tool": "run_with_secrets",
  "arguments": {
    "command": "python manage.py migrate",
    "project": "myapp",
    "env": "production",
    "working_dir": "/path/to/project"
  }
}
```

VaultKey fetches `DATABASE_URL`, `SECRET_KEY`, etc., injects them into the child process, and returns only the migration output. The LLM never sees `DATABASE_URL=postgres://...`.

---

## Security Notes

- **Audit trail**: Every `get_secret_value` and `run_with_secrets` call is logged in VaultKey's HMAC-chained audit ledger. Run `vaultkey audit` to review.
- **Least privilege**: Create a dedicated machine key per agent with access limited to the projects it needs.
- **Prefer `run_with_secrets`** over `get_secret_value` whenever the agent only needs a process to have a secret — not the secret itself.
- **Never commit** your `VAULTKEY_TOKEN` to version control.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VAULTKEY_SERVER` | `http://localhost:8080` | VaultKey API base URL |
| `VAULTKEY_TOKEN` | *(required)* | API key (`vk_...`) |
| `VAULTKEY_TIMEOUT` | `30s` | Request timeout (Go duration string) |
