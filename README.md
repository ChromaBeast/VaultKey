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
vaultkey unlock                  # Prompts for password securely (no terminal echo)
vaultkey status                  # Check state (Locked/Unlocked)
vaultkey lock                    # Instant memory zeroing

# Secrets CRUD
vaultkey set DB_PASS s3cret      # Encrypts and stores
vaultkey get DB_PASS             # Decrypts and prints
vaultkey list                    # Lists keys and versions (never values)

# Advanced CLI Features
vaultkey run -- npm start        # In-memory child process env injection
vaultkey export > .env           # Export active scope variables to dotenv
vaultkey audit                   # Lists logs and runs a live cryptographic verify check
```

---

## 📦 Developer SDKs

### Node.js SDK
```typescript
import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({ apiKey: process.env.VAULTKEY_TOKEN });

// Option A: Inject secrets directly into process.env in-memory
await vk.inject('my-project', 'production');

// Option B: Retrieve a single secret on-demand
const dbUri = await vk.get('DATABASE_URL');
```

### Python SDK
```python
from vaultkey import Vaultkey

vk = Vaultkey(api_key="vk_admin.abc123xyz")

# Load secrets into os.environ in-memory
vk.inject(project="backend", env="production")
```

---

## 🐳 Docker Deployment

```yaml
version: '3.8'
services:
  vaultkey:
    image: ghcr.io/vaultkey/vaultkey:latest
    ports: ["8080:8080"]
    volumes: ["./data:/var/lib/vaultkey"]
    environment:
      - VAULTKEY_PORT=8080
      - VAULTKEY_AUTO_LOCK=30m
    restart: unless-stopped
```
