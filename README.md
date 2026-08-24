# VaultKey 🗝️

VaultKey is an enterprise-grade, zero-trust secrets manager engineered on a core security principle: **secrets never exist in plaintext on disk, ever.** The master key exists strictly in memory (RAM), derived fresh on each unlock.

---

## 🔒 Security & Threat Model Architecture

### 1. Zero-Trust In-Memory Master Key
- **Argon2id Key Derivation**: When you unlock the vault, your password is run through memory-hard `Argon2id` (time=3, memory=64MB, threads=4) with a unique 32-byte salt stored in the database to derive a 32-byte AES-256 master key.
- **Strict Memory Lock**: The derived master key resides only in RAM. It never touches disk. When the vault locks or the auto-lock timeout triggers, the key bytes in memory are explicitly **zeroed out** (`for i := range key { key[i] = 0 }`) before the pointer is cleared.

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
```

> **WARNING - plaintext on disk:** `vaultkey export` and `vaultkey pull`
> write decrypted secrets as **PLAINTEXT** to disk. This directly contradicts
> VaultKey's zero-trust posture ("secrets never exist in plaintext on disk").
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
| `VAULTKEY_HMAC_KEY` | Server | Audit-log HMAC signing key. **Required in production**; the server refuses to boot if it matches any shipped default |
| `VAULTKEY_ENV` | Server | `dev` or `production` (default `production`). Production rejects demo/mock credentials; dev allows them |
| `VAULTKEY_DB_PATH` | Server | SQLite database file path |
| `VAULTKEY_AUTO_LOCK` | Server | Idle auto-lock duration, e.g. `30m` (**ENFORCED**: the server zeroizes the master key after this idle period) |
| `VAULTKEY_TURNSTILE_SECRET_KEY` | Server | Cloudflare Turnstile secret for bot protection |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Server | Razorpay billing credentials (demo/test values rejected in production) |
| `VAULTKEY_SERVER` | CLI | VaultKey server URL |
| `VAULTKEY_TOKEN` | CLI | Session token used by CLI/SDK requests |
| `VAULTKEY_TIMEOUT` | CLI | Request timeout for CLI commands |

See `.env.example` for a ready-made Docker deployment template.

---

## 🐳 Docker Deployment

```yaml
services:
  vaultkey:
    image: ghcr.io/chromabeast/vaultkey:latest
    ports: ["127.0.0.1:8080:8080"]
    volumes: ["./data:/var/lib/vaultkey"]
    environment:
      - VAULTKEY_ENV=production
      - VAULTKEY_PORT=8080
      - VAULTKEY_DB_PATH=/var/lib/vaultkey/vaultkey.db
      - VAULTKEY_AUTO_LOCK=30m
      # REQUIRED: the container refuses to start without it.
      # Create a .env file next to docker-compose.yml (see .env.example):
      #   VAULTKEY_HMAC_KEY=<64+ random chars>
      - VAULTKEY_HMAC_KEY=${VAULTKEY_HMAC_KEY:?set VAULTKEY_HMAC_KEY in .env}
    restart: unless-stopped
```

The bundled `docker-compose.yml` additionally ships:

- **Caddy** reverse proxy (ports 80/443, automatic HTTPS via `VAULTKEY_DOMAIN`)
- **Watchtower** auto-updates, enabled via the
  `com.centurylinklabs.watchtower.enable=true` label on the `vaultkey`
  service. Watchtower polls every 5 minutes and replaces the container when a
  new image is pushed to `ghcr.io/chromabeast/vaultkey`.
- A container healthcheck against `GET /healthz`; Caddy only starts routing
  once the backend reports healthy.
