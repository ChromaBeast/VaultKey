# VaultKey 🗝️

VaultKey stores secret values encrypted in its database and derives the master key in memory when a user unlocks the vault. Decrypted values exist in memory while in use. The explicit `export` and `pull` commands write plaintext to files chosen by the user; see the warning below.

---

## 🔒 Security & Threat Model Architecture

### 1. In-Memory Master Key
- **Argon2id Key Derivation**: When you unlock the vault, your password is run through memory-hard `Argon2id` (time=3, memory=64MB, threads=4) with a unique 32-byte salt stored in the database to derive a 32-byte AES-256 master key.
- **Memory key lifecycle**: The server derives the master key in process memory and explicitly zeroes it when the vault locks or the auto-lock timeout triggers. The operating system is not configured to pin key pages against swap or crash dumps.
- **Machine tokens**: Each API token stores its own copy of the org key, sealed with the token secret (HKDF-SHA256 + AES-256-GCM). A token can reopen a vault after an idle lock or a server restart, so CI and services keep working. An admin `vaultkey lock` *seals* the vault: tokens are refused until someone unlocks with a password. Revoke a token to remove its access.
- **Who can decrypt**: On the hosted service, the server process holds the org key while the vault is open, so the operator is part of your trust boundary. Self-host VaultKey to keep that boundary inside your own infrastructure.

### 2. Per-Item AES-256-GCM Encryption
- Each secret value is encrypted individually using `AES-256-GCM` with a cryptographically secure, random 12-byte nonce prepended to the ciphertext.

### 3. Tamper-Evident HMAC Chained Audit Log
- Every audit entry (e.g. `UNLOCK`, `READ`, `WRITE`) computes a `HMAC-SHA256` signature of:
  `HMAC(id + action + secretKey + project + actor + timestamp + prevHMAC)`
- Chaining to `prevHMAC` creates an immutable cryptographic ledger. Modifying, deleting, or reordering any entry invalidates the chain.

---

## 🛠️ CLI Operations

```bash
export VAULTKEY_SERVER="http://localhost:8080"
export VAULTKEY_TOKEN="vk_admin.abc123xyz"

# Vault control
vaultkey unlock                  # Prompts for EMAIL, then password securely (no terminal echo)
vaultkey status                  # Check state (Locked/Unlocked)
vaultkey lock                    # Instant memory zeroing

# Secrets CRUD
vaultkey set DB_PASS s3cret      # Encrypts and stores
vaultkey get DB_PASS             # Decrypts and prints
vaultkey list                    # Lists keys and versions (never values)
vaultkey versions DB_PASS        # Full version history of a secret
vaultkey rollback DB_PASS 3      # Restore version 3 as the current value
vaultkey delete DB_PASS          # Soft-delete a secret

# Projects
vaultkey projects                # List projects / active scope

# Advanced CLI Features
vaultkey run -- npm start        # In-memory child process env injection
vaultkey export > .env           # Export active scope variables to dotenv
vaultkey audit                   # Lists logs and runs a live cryptographic verify check
vaultkey mcp                     # Start stdio MCP server for Claude Code, Cursor, Antigravity
```

---

## 🤖 Model Context Protocol (MCP) Server

VaultKey includes a built-in MCP server for AI coding agents (`Claude Code`, `Cursor`, `Antigravity`):

```bash
# Start MCP server over stdio
vaultkey mcp
```

### Safety Features
- **Zero plaintexts in context**: Use `run_with_secrets` to run commands with injected environment variables — only command `stdout`/`stderr` is returned, keeping secrets out of LLM prompts and context windows.
- **Tamper-evident audit**: Every secret access is cryptographically signed into the HMAC ledger.
- **Config for Claude Desktop / Cursor**:
  ```json
  {
    "mcpServers": {
      "vaultkey": {
        "command": "vaultkey",
        "args": ["mcp"],
        "env": {
          "VAULTKEY_SERVER": "https://your-vaultkey-server.com",
          "VAULTKEY_TOKEN": "vk_your_machine_key_here"
        }
      }
    }
  }
  ```
See full documentation in [docs/MCP.md](docs/MCP.md) and on the Developer Docs page.

> **WARNING - plaintext on disk:** `vaultkey export` and `vaultkey pull`
> write decrypted secrets as **PLAINTEXT** to disk, outside the encrypted
> database. Treat those files as sensitive and remove them when finished.
> Prefer `vaultkey run -- <cmd>` or SDK injection (`inject()`), which keep
> secrets in memory only. Use `export`/`pull` solely for controlled,
> one-off migration scenarios and delete the file immediately afterwards.

---

## 📦 Developer SDKs

### Node.js SDK (requires Node >= 18)
```typescript
import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({ apiKey: process.env.VAULTKEY_TOKEN });

// Option A: Inject secrets directly into process.env in-memory
await vk.inject('my-project', 'production');

// Option B: Retrieve a single secret on-demand
const dbUri = await vk.get('DATABASE_URL');
```

### Python SDK
```bash
pip install vaultkey
```
```python
from vaultkey import Vaultkey

vk = Vaultkey(api_key="vk_admin.abc123xyz")

# Load secrets into os.environ in-memory
vk.inject(project="backend", env="production")
```

### Dart SDK
```dart
import 'package:vaultkey/vaultkey.dart';
```

---

## ⚙️ Configuration

| Variable | Scope | Description |
| --- | --- | --- |
| `VAULTKEY_PORT` | Server | Port override (default `8080`) |
| `VAULTKEY_HMAC_KEY` | Server | Audit-log HMAC signing key. **Required in production**; the server refuses to boot if it is a shipped default or shorter than 32 characters |
| `VAULTKEY_ENV` | Server | `dev` or `production` (default `production`). Production refuses to boot without a strong HMAC key, real Turnstile keys and a configured email provider (Brevo or SMTP). Set `dev` for local development |
| `VAULTKEY_DB_PATH` | Server | SQLite database file path |
| `VAULTKEY_AUTO_LOCK` | Server | Idle auto-lock duration, e.g. `30m`. The server zeroizes the master key after this idle period; API tokens created after this release reopen it automatically |
| `VAULTKEY_TRUSTED_PROXIES` | Server | Comma-separated proxy IPs/CIDRs whose `X-Forwarded-For` is trusted for client IPs (rate limits, lockouts, audit) |
| `VAULTKEY_TURNSTILE_SITE_KEY` / `VAULTKEY_TURNSTILE_SECRET_KEY` | Server/Web | Required Cloudflare Turnstile keys for production signup and login |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PLAN_PRO_ID`, `RAZORPAY_PLAN_ENTERPRISE_ID` | Server | Optional billing configuration; set all five values to enable checkout |
| `VAULTKEY_SERVER` | CLI | VaultKey server URL |
| `VAULTKEY_TOKEN` | CLI | Session token used by CLI/SDK requests |
| `VAULTKEY_TIMEOUT` | CLI | Request timeout for CLI commands |

See `.env.example` for a Docker deployment template and [Production Operations](docs/PRODUCTION_OPERATIONS.md) for launch setup and recovery steps.

---

## 🐳 Docker Deployment

Copy `.env.example` to `.env`, set the required HMAC and Turnstile keys, domain, and email settings, then run:

```bash
docker compose up -d
```

The bundled `docker-compose.yml` additionally ships:

- **Caddy** reverse proxy (ports 80/443, automatic HTTPS via `VAULTKEY_DOMAIN`)
- **Watchtower** auto-updates, enabled via the
  `com.centurylinklabs.watchtower.enable=true` label on the `vaultkey`
  service. Watchtower polls every 5 minutes and replaces the container when a
  new images are pushed to `ghcr.io/chromabeast/vaultkey-server` and
  `ghcr.io/chromabeast/vaultkey-web`.
- A container healthcheck against `GET /healthz`; Caddy only starts routing
  once the backend reports healthy.
