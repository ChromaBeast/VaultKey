---
name: vaultkey-docs
description: Write short, clear VaultKey developer docs (CLI, SDKs, MCP for any AI agent, REST API). Use when drafting, trimming, or reviewing any VaultKey docs page. Favors brevity, one working example per topic, and agent-agnostic MCP setup.
---

# VaultKey Docs (short and clear)

VaultKey is a self-hosted secrets manager: store secrets once, give them to apps and AI agents at runtime. Write docs a developer can scan in under a minute and copy-paste to get working.

## Principles

1. **Short.** One page, four sections. Each section is: one-line summary, one working example, a small reference table if needed. Cut anything the reader can't act on.
2. **Clear.** One name per concept. No marketing words. No background theory before the example.
3. **Agent-agnostic.** MCP works with any MCP client. Never present one agent as the default or imply others are unsupported.
4. **Honest.** Only state facts listed below. If unsure, add `<!-- TODO: confirm -->` and ask the maintainer.

## Page structure

1. **Quickstart** (3 steps: set server and token, pull or run, done)
2. **CLI**
3. **SDKs**
4. **MCP / AI agents**
5. **REST API**
6. **Security** (a short note only, see below)

Target length: about one screen per section. If a section grows longer, cut or move detail to a separate page.

## Facts

**Setup:** `VAULTKEY_SERVER` (your server URL) and `VAULTKEY_TOKEN` (a `vk_...` token). Secrets are organized by `project` and `env`.

**CLI:**
- `vaultkey pull --project=<p> --env=<e>`: write secrets to a local `.env`
- `vaultkey push --project=<p> --file=<path>`: upload a local env file
- `vaultkey run --project=<p> -- <cmd>`: run a command with secrets injected, nothing written to disk
- `vaultkey keys create --label "<name>"`: create a machine key
- `vaultkey mcp`: start the MCP server

**SDKs:** Node/TypeScript `vaultkey-js` (`new Vaultkey({ serverUrl, apiKey })`, `inject(project, env)`, `get(name)`). Python `vaultkey` (`Vaultkey(server_url=..., api_key=...)`, `inject(project=..., env=...)`).

**MCP:** `vaultkey mcp` is built into the CLI binary, speaks stdio JSON-RPC, and calls the server over REST. Every call is written to the audit log.

| Tool | Returns |
|---|---|
| `list_projects` | Projects the token can see |
| `list_secret_names` | Names only, never values |
| `check_missing_secrets` | Which expected names are missing |
| `set_secret_value` | Creates or updates a secret |
| `run_with_secrets` | stdout and stderr only. Values never reach the model. **Recommended.** |
| `get_secret_value` | Plaintext value into the model context. Use only when unavoidable. |

`run_with_secrets` arguments: `command`, `project`, `env`, `working_dir`.

**REST API:**

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/v1/auth/signup` | Create org and admin | Public |
| POST | `/v1/auth/login` | Log in | Public |
| POST | `/v1/secrets` | Create or update a secret | Bearer |
| GET | `/v1/secrets/values` | Fetch decrypted values | Bearer |
| POST | `/v1/shares` | One-time secret link | Bearer |

**Security note (keep to 3 to 4 lines):** secrets are encrypted with AES-256-GCM, keys derived with Argon2id, access is role-based, and the audit log is HMAC-chained so tampering is detectable. Do not include formulas, parameters, or code unless asked.

## MCP section: how to write it

Show the setup once, in a way that works for every agent.

1. Create a machine key per agent: `vaultkey keys create --label "<agent>"`.
2. Show the **universal config**. Most clients use this same shape:

```json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://your-vaultkey-server.com",
        "VAULTKEY_TOKEN": "vk_your_token_here"
      }
    }
  }
}
```

3. Then give a compact client table. Point to each client's own MCP docs and mark entries "verify against the client's docs", since config locations change.

| Client | Where the config goes | Format note |
|---|---|---|
| Claude Code | `claude mcp add` or project `.mcp.json` | Universal JSON |
| Claude Desktop | `claude_desktop_config.json` | Universal JSON |
| Codex CLI | `~/.codex/config.toml` | TOML: `[mcp_servers.vaultkey]` with `command`, `args`, `env` |
| Gemini CLI | `~/.gemini/settings.json` | Universal JSON |
| Cursor | `.cursor/mcp.json` or `~/.cursor/mcp.json` | Universal JSON |
| Antigravity | MCP settings in the app | Universal JSON |
| VS Code (Copilot) | `.vscode/mcp.json` | Uses `servers` instead of `mcpServers` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | Universal JSON |
| Any other MCP client | See its docs | Command `vaultkey`, args `["mcp"]`, two env vars |

Rules for this section:
- Do not write a separate long example for each client. One universal block plus the table.
- Include one short TOML example only for Codex.
- Always end with a one-line tip: prefer `run_with_secrets` over `get_secret_value`, and use one machine key per agent so it can be revoked alone.

## Writing rules

- Second person, present tense, short sentences. Prefer a table or numbered list over paragraphs.
- Every code block has a language tag and runs as written. Comment only the non-obvious lines.
- Placeholders only: `https://your-vaultkey-server.com`, `vk_your_token_here`. Never realistic keys.
- Terms: **VaultKey** in prose, `vaultkey` for the binary. Use "your VaultKey server", not "SaaS" or "cloud", unless a hosted version is confirmed.
- Use `project` and `env` everywhere. State which project and env `get(name)` reads from once confirmed.
- No filler: skip "In this section we will...", intros that restate the heading, and closing summaries.
- Warnings only for real risks (leaking values, losing keys), as `> **Warning:** ...`.

## Workflow

1. Confirm the section being written or trimmed.
2. Draft with the structure above. Then cut: remove every sentence that does not help the reader act.
3. Check each command, flag, and endpoint against the facts above. Flag anything unlisted.
4. Output Markdown unless asked otherwise.
