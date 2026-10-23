# VaultKey Developer Documentation

VaultKey is a self-hosted secrets manager: store secrets once, give them to apps and AI agents at runtime.

## Quickstart

Set your server and token, then pull secrets or run your app directly.

1. Set your environment variables:

```bash
export VAULTKEY_SERVER="https://your-vaultkey-server.com"
export VAULTKEY_TOKEN="vk_your_token_here"
```

2. Pull secrets to a local `.env` file or run your command directly:

```bash
# Option A: Write secrets to local .env
vaultkey pull --project=backend --env=production

# Option B: Run a command with secrets injected into memory (nothing written to disk)
vaultkey run --project=backend -- npm start
```

3. Done.

## CLI

Authenticate, sync local files, run commands with injected secrets, or manage keys.

```bash
# Pull secrets to local .env
vaultkey pull --project=backend --env=production

# Upload a local env file
vaultkey push --project=backend --file=.env

# Run a command with secrets injected (nothing written to disk)
vaultkey run --project=backend -- npm start

# Create a machine key
vaultkey keys create --label "ci-runner"

# Start the MCP server
vaultkey mcp
```

| Command | Description |
|---|---|
| `vaultkey pull --project=<p> --env=<e>` | Write secrets to a local `.env` |
| `vaultkey push --project=<p> --file=<path>` | Upload a local env file |
| `vaultkey run --project=<p> -- <cmd>` | Run a command with secrets injected, nothing written to disk |
| `vaultkey keys create --label "<name>"` | Create a machine key |
| `vaultkey mcp` | Start the MCP server |

## SDKs

Inject secrets into application memory at runtime.

### Node.js / TypeScript (`vaultkey-js`)

```typescript
import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({
  serverUrl: process.env.VAULTKEY_SERVER || 'https://your-vaultkey-server.com',
  apiKey: process.env.VAULTKEY_TOKEN || 'vk_your_token_here',
});

// Inject secrets into process.env in memory
await vk.inject('backend', 'production');

// Or fetch a single secret
// <!-- TODO: confirm which project and env get(name) reads from -->
const dbUrl = await vk.get('DATABASE_URL');
```

### Python (`vaultkey`)

```python
from vaultkey import Vaultkey

vk = Vaultkey(
    server_url="https://your-vaultkey-server.com",
    api_key="vk_your_token_here",
)

# Inject secrets into os.environ in memory
vk.inject(project="backend", env="production")
```

| Language | Package | Initialization | Inject into environment | Fetch single secret |
|---|---|---|---|---|
| Node.js / TypeScript | `vaultkey-js` | `new Vaultkey({ serverUrl, apiKey })` | `await vk.inject(project, env)` | `await vk.get(name)` |
| Python | `vaultkey` | `Vaultkey(server_url=..., api_key=...)` | `vk.inject(project=..., env=...)` | — |

## MCP / AI agents

`vaultkey mcp` is built into the CLI binary, speaks stdio JSON-RPC, and calls the server over REST. Every call is written to the audit log.

### Setup

1. Create a machine key per agent:

```bash
vaultkey keys create --label "<agent>"
```

2. Universal configuration (most clients use this same shape):

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

For Codex CLI (`~/.codex/config.toml`):

```toml
[mcp_servers.vaultkey]
command = "vaultkey"
args = ["mcp"]

[mcp_servers.vaultkey.env]
VAULTKEY_SERVER = "https://your-vaultkey-server.com"
VAULTKEY_TOKEN = "vk_your_token_here"
```

3. Client configuration locations:

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

*(Verify entries against each client's docs, as config locations change.)*

### Available tools

| Tool | Returns |
|---|---|
| `list_projects` | Projects the token can see |
| `list_secret_names` | Names only, never values |
| `check_missing_secrets` | Which expected names are missing |
| `set_secret_value` | Creates or updates a secret |
| `run_with_secrets` | stdout and stderr only. Values never reach the model. **Recommended.** |
| `get_secret_value` | Plaintext value into the model context. Use only when unavoidable. |

`run_with_secrets` arguments: `command`, `project`, `env`, `working_dir`.

> **Tip:** Prefer `run_with_secrets` over `get_secret_value`, and use one machine key per agent so it can be revoked alone.

## REST API

Interact directly with your VaultKey server over HTTP.

```bash
# Fetch decrypted values
curl -s -X GET "https://your-vaultkey-server.com/v1/secrets/values?project=backend&env=production" \
  -H "Authorization: Bearer vk_your_token_here"
```

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/v1/auth/signup` | Create org and admin | Public |
| POST | `/v1/auth/login` | Log in | Public |
| POST | `/v1/secrets` | Create or update a secret | Bearer |
| GET | `/v1/secrets/values` | Fetch decrypted values | Bearer |
| POST | `/v1/shares` | One-time secret link | Bearer |

## Security

Secrets are encrypted with AES-256-GCM, keys derived with Argon2id, access is role-based, and the audit log is HMAC-chained so tampering is detectable.
