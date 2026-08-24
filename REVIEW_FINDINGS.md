# VaultKey — Full Repository Review

**Date:** 2026-08-24 · **Scope:** Go server, CLI, Node/Python/Dart SDKs, React web app, Docker/CI/installer, product claims vs. implementation.
**Method:** 4 parallel review passes (server internals · SDKs & CLI · frontend/UI · product gaps & infra), cross-checked against source with file:line references.

---

## 0. Executive Summary

The core crypto architecture is **real and mostly sound**: Argon2id (64 MiB) key derivation, per-secret AES-256-GCM with random nonces, HMAC-chained audit ledger with a live verify endpoint, secret versioning, and genuinely in-memory `run --` / SDK injection. However:

1. **The flagship CLI workflow is broken.** `vaultkey unlock` calls `POST /v1/vault/unlock`, which no server handler serves (404). `vaultkey status` always reports "Locked".
2. **Billing is bypassable.** Any signature starting with `mock_sig_` is accepted as valid; the subscription verify endpoint also trusts a client-supplied `plan` string. Pro/Enterprise is free for anyone who asks.
3. **The headline claim — "secrets never touch disk" — is violated** by share links (client plaintext stored verbatim in SQLite) and by documented `export > .env` / `pull` behavior.
4. **The tamper-evident audit chain is forgeable in practice**: the HMAC signing key ships committed in `vaultkey.yaml`, the Docker image, and docker-compose defaults — and the chain forks permanently under any concurrent write traffic.
5. Several authorization gaps (unprotected rollback/share/lock endpoints) let low-privilege keys perform privileged operations.
6. The frontend has two broken core flows (generated secret discarded on "Use Secret"; false "TAMPERED" alarm during load) plus significant accessibility/responsive debt.

Severity counts: **8 critical · 15 high · 30+ medium · 25+ low**, detailed below.

---

## 1. CRITICAL — fix before any production exposure

| # | Area | Finding | Where |
|---|------|---------|-------|
| C1 | CLI | **`vaultkey unlock` is broken.** Client calls `POST /v1/vault/unlock`; no such route exists server-side (only `/v1/vault/status` and `/v1/vault/lock`). Every unlock attempt gets a 404. Vault can only be unlocked via web login. | `internal/client/client.go:88`, `internal/api/server.go:79–114` |
| C2 | CLI/API | **`vaultkey status` always prints "Locked".** Route sits outside the auth group, so `org_id` never resolves from the token; empty orgID defaults to locked. Bonus: `?org_id=` query param lets unauthenticated callers probe arbitrary org lock states. | `internal/api/server.go:81`, `internal/api/auth.go:26–44`, `cmd/vaultkey/commands.go:43–56` |
| C3 | Billing | **Payment bypass via `mock_sig_`.** Server accepts any payment/subscription whose signature starts with `mock_sig_`; the web client even auto-fabricates one when the Razorpay CDN fails to load. Any user self-upgrades to Pro/Enterprise free. | `internal/api/payments_handler.go:105–107`, `internal/api/subscriptions_handler.go:69–71`, `web/src/lib/razorpay.ts:21–28` |
| C4 | Billing | **Client-controlled `plan` in subscription verify** (independent of C3). Signature covers only `paymentID\|subID`; `plan` comes from the request body and is written to `organizations.plan`. Any non-"free" string defeats every tier gate. Subscription IDs are also replayable across orgs (nothing persisted at creation). | `internal/api/subscriptions_handler.go:77–83`, `razorpay_client.go:122–127` |
| C5 | Security | **Share links store plaintext secrets on disk** — client-supplied value saved verbatim into `shared_secrets.ciphertext`, never encrypted with the org master key. Directly contradicts README:3 / PRODUCT.md positioning line ("verifiable in the source"). | `internal/api/shares_handlers.go:46`, `internal/db/shares.go:21–24`, `web/src/pages/SecretsPage.tsx:63` |
| C6 | Audit | **Committed default HMAC signing key makes the "immutable ledger" forgeable.** Key lives in `vaultkey.yaml:4`, is copied into the public Docker image (`Dockerfile:6`), and compose ships a static "change-me" key. Anyone with repo/image access can rewrite rows *and* recompute valid HMACs. Same class: demo Razorpay credentials hardcoded in `internal/config/config.go:32–34`. | `vaultkey.yaml:4`, `Dockerfile:6`, `docker-compose.yml:13`, `internal/config/config.go:31–34` |
| C7 | Docs vs code | **Documented features write plaintext to disk.** `export > .env` (README:41) persists decrypted secrets via shell redirection; `pull` explicitly writes a plaintext `.env` (`os.WriteFile(..., 0600)`). Contradicts the central architectural claim. | `cmd/vaultkey/commands_secrets.go:62–88`, `cmd/vaultkey/cmd_pull_push.go:11–43` |
| C8 | Frontend | **"Use Secret" discards the generated value.** Generator modal emits `(secret: string)` but SecretsPage's callback ignores it — users generate a strong secret, click Use, and the Create form opens **empty**. Core workflow broken. | `web/src/pages/SecretsPage.tsx:185`, `components/SecretGeneratorModal.tsx:78` |

---

## 2. HIGH severity

### Backend / security
| # | Finding | Where |
|---|---------|-------|
| H1 | **Rollback endpoint has NO permission check.** Only handler that skips `checkAuth(c, "write", proj)` — a read-only or list-only leaked key can replace production secret values. | `internal/api/secrets_rollback_handler.go:15–39` |
| H2 | **Audit hash chain forks under concurrent writes.** Read-last-entry → sign → insert isn't transactional/mutexed; two parallel audited requests chain from the same parent → verification reports `verified:false` forever after ordinary traffic. | `internal/api/audit_helper.go:12–43` |
| H3 | **Lost-update race on secret updates.** Get runs outside tx; UPDATE lacks `AND version=?` guard; `secret_versions` lacks `UNIQUE(secret_id, version)`. Concurrent PUTs silently lose a revision permanently and undetectably. | `internal/db/secrets.go:50–75`, `internal/api/secrets_mutations.go:30–53`, `schema.sql:39–46` |
| H4 | **Master-key race: `crypto.Global.Get()` returns the live slice; `Lock()` zeroes it mid-AES operation** → data races, spurious failures, or ciphertexts sealed under a partially-zeroed (undecryptable) key. Return a copy / hold RLock across cipher ops. | `internal/crypto/master.go:94 vs 58–62`, `internal/crypto/secret.go:11–31` |
| H5 | **Multi-user orgs are cryptographically impossible**: the org master key derives from each *login* password and must match the founder's sentinel. Second user ≠ same password ⇒ cannot unlock. Architecture of a personal vault wearing a SaaS costume — needs envelope-encrypted per-org data keys wrapped per-user. | `internal/api/user_auth.go:162–176` |
| H6 | **Auto-lock timeout configured everywhere, enforced nowhere.** `VAULTKEY_AUTO_LOCK=30m` documented in README/compose/installer; config parsed then referenced by nothing; zero timers/goroutines in the codebase. An unlocked org stays unlocked until restart. | `internal/config/config.go:14,68–69`, README:11 |
| H7 | **Secrets API published on plain HTTP past the TLS proxy.** Compose maps `8080:8080` on 0.0.0.0; bootstrap advertises `http://<ip>:8080`. Bearer tokens + decrypted secrets readable on the wire, bypassing Caddy. | `docker-compose.yml:5–6`, `bootstrap.sh:94` |
| H8 | **Razorpay AutoPay renewals never processed end-to-end.** Webhook skips verification when header absent and processes zero events; no cron enforces `current_period_end` downgrade; plan IDs are placeholders that 400 against real Razorpay. PRODUCT.md's "production-ready" claim does not hold. | `payments_handler.go:147–157`, `subscriptions_handler.go:37–43`, `razorpay_client.go:87–95` |

### CLI / SDKs
| # | Finding | Where |
|---|---------|-------|
| H9 | **`SetSecret` create-vs-update probing broken 3 ways:** empty-string values treated as nonexistent → UNIQUE constraint error; `write`-without-`read` keys always take POST → every update 500s; every successful `set` pollutes the ledger with an extra READ entry. | `internal/client/secrets.go:51–66`, `internal/api/secrets.go:133–151` |
| H10 | **No HTTP timeouts/retries anywhere** — Go `http.Client{}` zero-value (hangs forever); Node bare fetch; Python `urlopen` without timeout, and connection-refused `URLError` uncaught (raw traceback). | `internal/client/client.go:28`, `sdk/node/src/index.ts:35`, `sdk/python/vaultkey.py:25–28` |
| H11 | **Node SDK dist build is stale and worse than src**: `dist/index.d.ts` missing `values()`; `dist/inject()` still uses N+1 loop (slow + audit-spamming). No `prepublishOnly` guard. npm consumers get the old behavior. | `sdk/node/dist/*`, `sdk/node/package.json:5–9` |
| H12 | **Python SDK not packaged**: single module file, no pyproject/setup, not installable/importable per README claim, no PyPI publish path. | `sdk/python/vaultkey.py` |

### Infra
| # | Finding | Where |
|---|---------|-------|
| H13 | **Installer can't install anything**: download lines commented out, systemd unit points at a binary that's never created, wrong release URL/org, asset-name mismatch vs CI artifacts, runs as root, no checksums, Linux/macOS-only despite Windows binaries shipping. | `installer/install.sh:24–60`, `.github/workflows/release.yml` |
| H14 | **Watchtower promised, never deployed** — bootstrap + deploy.yml narrate auto-pull updates; compose defines only vaultkey+caddy. And the SSH deploy step is `continue-on-error: true`, masking failed deploys. | `bootstrap.sh:5–6,99–100`, `.github/workflows/deploy.yml:101,106` |
| H15 | **README Docker snippet silently loses all data**: mounts `/var/lib/vaultkey` but default DB path is relative `vaultkey.db` in CWD `/app` → DB lands in container layer, gone on recreate. Works only because compose separately sets `VAULTKEY_DB_PATH`. Also README points to `ghcr.io/vaultkey/vaultkey` while the real image is `ghcr.io/chromabeast/vaultkey`. | `README.md:80–85`, `internal/config/config.go:29`, `cmd/server/main.go:14,24` |

### Frontend
| # | Finding | Where |
|---|---------|-------|
| H16 | **Share page burns one-time links on load** — secret fetched immediately, no reveal gate; email/Slack link-preview bots consume the single view before the human sees it. Needs click-to-reveal + AbortController. | `web/src/pages/SharePage.tsx:9–22` |
| H17 | **False "TAMPERED" alarm**: audit page renders red "Chain Status: Tampered" whenever verify hasn't returned yet (load, or silent fetch failure). An incident-response landmine in a security product. | `web/src/pages/AuditPage.tsx:59,16–19` |
| H18 | **No way to delete or edit a secret from the dashboard** although `PUT`/`DELETE /v1/secrets/:key` exist. Day-2 ops of a secrets manager are CLI-only. | `web/src/pages/SecretsPage.tsx` (missing), `internal/api/server.go:94–95` |

---

## 3. BUGS

### 3.1 Server (Go)
- **Lock endpoint unauthenticated-ish**: any authenticated key (even read-only) can lock the whole org vault → DoS until password login. `internal/api/auth.go:9–24`
- **Share creation skips permission checks** entirely; `MaxViews` unbounded (`999999999` ≈ permanent link). `shares_handlers.go:18–56`
- **API-key permissions string accepted verbatim** — no enum whitelist (`admin|write|read|list`). `keys.go:43–45`
- **No password policy** (1-char passwords become Argon2id vault keys); timing-based account enumeration on login (unknown email skips bcrypt ~60–100ms cheaper). `user_auth.go:33–35,116–118`
- **Login-lockout counter non-atomic** (read-modify-write): parallel brute force evades the lockout indefinitely. `db/users.go:62–85`
- **Signup non-transactional across org+user**: failed CreateUser leaves orphaned orgs and burned slugs. `user_auth.go:79–103`
- **Rollback ignores environments** (hardcoded `"production"`) and reads project from body instead of query like every other secret endpoint; DB errors masked as 404. `secrets_rollback_handler.go:31–38`
- **Version-history endpoint**: returns fully decrypted values of ALL versions to mere `read` keys, swallows decrypt errors (`plain, _ := Decrypt`), writes NO audit entry (unlike get). `secrets_mutations.go:109–125`
- **Silent audit loss**: every `_ = s.LogAuditOrg(...)` discards failure; `GetLastAuditEntry` error resets `prevHMAC=""` snapping the chain; CREATE_KEY/REVOKE_KEY don't record which key ID; BATCH_READ doesn't record which keys; **share reveals aren't audited at all**.
- **`vault_config` table doesn't exist** though Get/SetConfig query it (time bomb when wired up). `db/config.go:9–28`, schema.sql
- **Single pooled connection (`SetMaxOpenConns(1)`)** serializes everything incl. full-ledger verify; WAL useless; PRAGMAs applied to whichever connection `Exec` grabbed — recycled connections silently revert `foreign_keys=OFF`, disabling cascades. Set pragmas via DSN instead. `db/db.go:27–31`
- **Missing indexes**: `secrets(org_id, project, environment)`, `secret_versions(secret_id)`, cleanup indexes on expiry columns. `schema.sql:94–97`
- **`audit_log ... ON DELETE CASCADE`** — deleting an org destroys its entire audit trail; an immutable log must never cascade-delete evidence. `schema.sql:63`
- **HMAC input ambiguity**: fields concatenated without length framing (`("A","BC")` == `("AB","C")`) → insider-craftable colliding signatures; verify uses non-constant-time hex compare. `crypto/hmac.go:23–26`, `api/audit.go:60`
- **Chain verification depends on timestamp round-trip formatting** (RFC3339 second precision through driver/storage) — any storage change invalidates all historical verification. Persist the signed timestamp string. `audit_helper.go:24,28,40`
- **Unbounded/negative pagination**: `?limit=-1` → SQLite dumps the full table. Clamp 1..500. `audit.go:18–19`
- **Revoke ignores RowsAffected** — revoking nonexistent/foreign key IDs reports success. `db/keys.go:85–87`
- **Batch export aborts on first bad ciphertext** and leaks the failing key name. `secrets.go:174–181`
- **`index.html` served at `/` inherits MaxAge=31536000** → stale apps after deploys. `server.go:117–121`
- **No ReadTimeout/WriteTimeout/IdleTimeout, no recover middleware** — slowloris-friendly; one panic = crash-loop (Fiber v2 doesn't recover by default). `server.go:29–31`
- **`c.IP()` behind any proxy is the proxy's IP** → rate limiter buckets all users together; Turnstile remoteip mismatches. Needs trusted-proxy handling. `server.go:70`, `turnstile.go:38`
- **CSP includes `unsafe-inline` + `unsafe-eval`**, largely negating script protection. `middleware.go:79`
- **Truncated UUID PKs** (`pay_xxxxxxxx`, `ver_xxxxxxxx` — 32-bit): birthday collisions ~65k rows → 500s. `payments_handler.go:64`, `secrets_rollback_handler.go:50`
- **Argon2id params hardcoded, not persisted per-org** — raising them later makes existing orgs undecryptable. Store params beside `argon2_salt`. `crypto/master.go:39–46`
- **Fake provider IDs on upstream failure**: CreateOrder/CreateSubscription fabricate `order_<nanotime>`/`sub_<nanotime>` with nil error on Razorpay outage → phantom billing records. `razorpay_client.go:84,112`
- **Payment verify has no ownership scoping** (cross-org order-ID tampering; foreign signed orders upgrade caller using victim's plan). `payments_handler.go:98–118`

### 3.2 CLI / SDKs
- `export` dotenv output unescaped (multi-line/`#`/quotes corrupt files) and unknown `--format` silently exits 0 printing nothing; same escaping issue in `pull`. `commands_secrets.go:78–86`, `cmd_pull_push.go:33–35`
- `push` always exits 0 even on total failure (breaks CI); lossy parser (`strings.Trim(v,"\"'")` strips legitimate quotes; no `export KEY=`/inline comments/multiline). `cmd_pull_push.go:61–88`
- `export` and `run` use N+1 requests (list then get-per-key → N extra READ audit entries) while the batch endpoint exists; any mid-loop failure aborts leaving partial results. Ironically `pull` already uses batch. `commands_secrets.go:72–86`, `run.go:25–39`, `internal/api/secrets.go:160–187`
- `run --` loses the child's real exit code (generic error, always exit 1). `run.go:50–52`
- Silent flag-swallowing: `set KEY VAL --project=staging` parses the flag as a positional arg → secret written to default project. All command flag sets stop at first non-flag arg. `commands*.go`
- Secret passed as argv (`set KEY s3cret`) → visible in shell history and process lists; offer prompt/stdin. `commands_secrets.go:19–23`
- Password `TrimSpace`d (whitespace-edged passwords unusable); trimmed bytes not zeroed. `commands.go:16–22`
- Usage text omits `unlock` itself plus `--project/--env` flags; `-h/--help` bubbles up as `Error: flag: help requested` exit 1. `main.go:54–77,48–50`
- Node SDK: null-deref path throws misleading TypeError masking real API errors; `inject()` clobbers existing env entries with no override option/conflict warning; no apiKey validation (`Bearer undefined`). `src/index.ts:43,74–79`
- Python SDK: wrong type hints (`-> dict` for list responses); Dart SDK exists but is documented nowhere and honestly returns a Map (can't mutate Platform.environment).
- `0600` file mode is a POSIX no-op on Windows (ACL-inherited readability).

### 3.3 Frontend (React)
- Race condition: `loadSecrets` has no AbortController/request-id — fast project switching lets a stale response overwrite the newer table+metrics. `pages/SecretsPage.tsx:29–43`
- `handleCreateKey` has no try/catch — free-tier rejection is an unhandled rejection, modal closes, zero feedback. `pages/ApiKeysPage.tsx:31–39`
- Path/query params interpolated without `encodeURIComponent` (keys/projects/shareIds with reserved chars → wrong URLs). `lib/api.ts:144–146`, `App.tsx:27`
- `await res.json()` unconditional — a 502 HTML page throws SyntaxError masking the status. `lib/api.ts:80`
- `navigator.clipboard.writeText` with no catch/fallback in 6 places — silent no-op on self-hosted HTTP LAN deployments while button shows "✓ Copied". Multiple files
- Free-plan usage badge counts only current project against the org-wide "/25" quota → misleading headroom. `SecretsPage.tsx:93`
- Auth persistence: unguarded `JSON.parse` of localStorage → corrupted key white-screens the app at boot. `context/AuthContext.tsx:25–33`
- Login ignores `location.state.from` — deep-linked users always land on `/secrets`. `pages/Login.tsx:27`
- Razorpay script-load failure triggers a **mock payment sent to the real verify endpoint in production** (frontend half of C3); `amountLabel` prop declared/passed/never used. `lib/razorpay.ts:21–28`
- Two competing ⌘K listeners mutate palette state through different paths — double-toggle edge cases. `AppLayout.tsx:9–18`, `CommandPaletteModal.tsx:20–36`
- No ErrorBoundary anywhere: render exception = blank page.
- `vite.config.ts` has no `/v1` dev proxy — contributors' `npm run dev` can't reach the API at all.
- Generator has negligible modulo bias; doesn't auto-regenerate on option toggle. `SecretGeneratorModal.tsx:27`

### 3.4 Infra / deployment
- `VAULTKEY_PORT` documented (README:84, compose:10) but never read by config code.
- Dockerfile copies pre-built `server` binary from context — the one in-repo right now is a **Windows PE**; local `docker build` produces a broken image. Single-stage, root user, no HEALTHCHECK, amd64 only. `Dockerfile:1–9`
- Turnstile CAPTCHA is fail-open and off-by-default (ships Cloudflare's always-pass test secret; empty secret silently skips verification). `config.go:36`, `turnstile.go:24–28`
- Ad-hoc `_ = db.Exec("ALTER TABLE ...")` migrations, ignored errors, no version tracking. `db/db.go:40–44`
- No graceful shutdown (SIGTERM kills in-flight requests). `cmd/server/main.go:32–34`
- No backup strategy for single-node SQLite volume.
- bootstrap.sh: `curl | sh` Docker install, PAT copied to `/root/.docker`.

---

## 4. MISSING FEATURES

### 4.1 Product claims vs reality

| Claim (source) | Status | Evidence |
|---|---|---|
| Argon2id 64MB, RAM-only key, zeroing on lock | ✅ Real | `crypto/master.go:35–61` |
| Per-secret AES-256-GCM, random nonce | ✅ Real | `crypto/secret.go:26–31` |
| HMAC-chained audit + live verify | ⚠️ Real but forgeable (C6) & fork-prone (H2) | `api/audit.go:43–72` |
| Versioning + 1-click rollback | ⚠️ Yes, prod-env only, race-prone (H3/H1) | `secrets_rollback_handler.go` |
| 1-time share links (max_views/TTL) | ⚠️ Mechanism yes; plaintext-at-rest violation (C5) | `shares_handlers.go` |
| Razorpay recurring/AutoPay "production-ready" | ❌ Stub: mock bypass, placeholder plans, no renewal engine (C3/C4/H8) | payments/subscription handlers |
| Multi-tenant orgs/projects/RBAC | ⚠️ Partial: API-key RBAC enforced; **every login mints an admin session**; no invite/member endpoints; multi-user crypto-broken (H5) | `user_auth.go:215` |
| Auto-lock timeout | ❌ Config parsed, never enforced (H6) | `config.go:14,68–69` |
| Go SDK | ❌ Absent (PRODUCT.md claims Node.js, Python, Go) | `sdk/` has node/python/dart |
| SOC 2 Type II readiness posture | ❌ Zero compliance artifacts/docs/evidence exports | marketing copy only |
| Watchtower auto-deploy | ❌ Never installed (H14) | compose |

### 4.2 Server-side gaps expected of an "enterprise-grade" secrets manager
- Secret metadata: tags/folders/search/filtering/sorting (only exact-key GET exists)
- Rotation reminders / secret expiry metadata
- Encrypted backup/export snapshots
- Per-secret ACLs
- Soft delete/trash/restore (delete purges versions irrecoverably)
- Pagination everywhere (lists return all rows)
- Health/readiness/liveness endpoints, metrics, request IDs, structured logging
- Password change/reset/forgot-password, MFA/TOTP, session management (device list, revoke-all)
- Webhook dispatcher (DB layer exists; zero routes/dispatcher)
- Subscription period-end enforcement/auto-downgrade
- Project CRUD entity (projects are free-text strings)

### 4.3 CLI gaps (client method + server route exist, no subcommand)
- `delete/rm <key>` (DeleteSecret unused), `versions <key>`, `rollback <key>`, `projects` list
- `--limit/--offset/--json` flags for `audit`; document that verify is server-side trust model

### 4.4 Dashboard gaps (ordered by user impact)
1. Delete/Edit secrets UI (wired endpoints exist)
2. Profile/settings pages: change password, rotate keys, manage sessions (no endpoints either)
3. Team/RBAC member management (promised in Pro pricing copy!)
4. Filters/sort/pagination on Secrets/Keys/Audit tables; CSV export of audit
5. Bulk select/operations; .env import/export UI (batch endpoint exists)
6. Share-link management list (create-and-forget today)
7. Favorites/pinning, folders/tags
8. Secret diff viewer (versions show number+date only)
9. Forgot-password flow, onboarding flow, 404 page, keyboard-shortcut help

### 4.5 Tests & quality gates
- **Frontend: zero tests** (no script/deps in package.json)
- CI: no `go vet`/golangci-lint, no `npm run lint` despite eslint configured, no checksums/signing on releases, no arm64 image, SSH deploy uses `StrictHostKeyChecking no`
- Go side: 7 smoke-test files exist (api, security, payments, subscriptions, crypto, hmac, db) — none cover rollback/share security properties

---

## 5. UI IMPROVEMENTS (prioritized)

### Top 10 quick wins
1. Fix "Use Secret" discarding generated value (C8) — lift generated state to page
2. Click-to-reveal gate on share page (H16)
3. Three-state audit chain status — never show "Tampered" during load/failure (H17)
4. Add Delete + Edit secret row actions w/ styled confirm modal (H18)
5. Shared `<Modal>` primitive: focus trap, Esc close, `role="dialog"`/`aria-modal`, scroll-lock, backdrop consistency — apply to all 7 modals
6. Keyboard-complete the command palette (arrow keys, Enter, roving highlight, listbox roles); restore `.btn:focus-visible` rings
7. Skeleton loading rows for all tables + pending indicator on Reveal
8. Separate "empty project" vs "no search results" states (drop create CTA when filtering)
9. Responsive shell: collapsible sidebar ≤1024px, hamburger nav, table→card fallback (fixed 220px sidebar is the largest responsive debt; on-call engineers use phones)
10. Unify feedback: kill all `alert()`/`confirm()` → Toast system + styled ConfirmDialog with global `aria-live` toaster

### Accessibility (WCAG AA failures)
- `.btn { outline: none }` removes focus indicators from every button with no replacement — WCAG 2.4.7 fail. `index.css:121`
- Contrast: `#334155` footer text on `#090c14` ≈ 2.3:1; `#64748b` small text ≈ 3.8:1 (sidebar org name, palette empty text, footers) — below AA 4.5:1
- Icon-only close buttons lack `aria-label`; `<th>` lack `scope="col"`; hero tabs lack tablist roles; no skip-to-content link
- Toasts have no `aria-live`; Escape works in only one of seven modals

### Design-language issues (vs stated PRODUCT.md principles)
- Pervasive emoji iconography (🎲👁️🔥✨⚡🔒🛡️📜🗝️) contradicts "quiet confidence… not playful"; `lucide-react` installed, imported zero times
- Exclamation-heavy microcopy ("Copy this token immediately!")
- `.glass:hover` lifts entire data-table containers 2px — noisy motion on dense surfaces
- Method-badge colors semantically arbitrary (GET=amber "admin", signup POST=indigo "read")
- Pricing copy contradictions erode trust in a compliance tool: "30-day" vs "7-day" audit retention between pages; "Start 14-Day Trial" button that actually bills ₹1,499 immediately; version history advertised Pro-gated but available to all
- Dead/dishonest buttons: enabled "Downgrade to Free" with no onClick; "Contact Sales" fakes success without transmitting anything (`BillingPage.tsx:108–110,157`)
- Anonymous visitors clicking header/footer Docs/Pricing bounce to login — marketing dead-ends its hottest CTAs (`LandingHeader.tsx:69–80`)
- Hardcoded Mac ⌘K glyph on Windows/Linux; fabricated `'127.0.0.1'` rendered in the audit trail when IP missing (`AuditPage.tsx:83` — never invent forensic data)
- Duplicate controls per row (version chip and Rollback button both just open history modal); `SecurityDocSection` renders literal markdown backticks; wildcard 404s silently redirect to `/`

### Code quality (web)
- `"strict": true` missing from tsconfig.app.json — strict null checks would have caught H17-class bugs
- LoC>200 violations of the project's own constraint: `SecretsPage.tsx` (211), `BentoGridSection.tsx` (206), `Sidebar.tsx` (201), `index.css` (240)
- Dead code: `Header.tsx` (188 lines, imported nowhere), `App.css`, unused assets, unused razorpay helpers
- Clipboard logic re-implemented inline 6× → extract `useClipboard()`
- ~90% styling inline objects alongside a hand-rolled token system in index.css — pick one

---

## 6. REPO HYGIENE

- **~281 vendored files tracked in git**: `sdk/node/node_modules/**`, `sdk/node/dist/**` (stale!), `sdk/dart/.dart_tool/**`. Root binaries/db (`vaultkey.db*`, `*.exe`) are properly ignored and were never committed historically (verified via git log). Fix: `git rm -r --cached sdk/node/{node_modules,dist} sdk/dart/.dart_tool` + widen .gitignore.
- **No LICENSE file anywhere** — blocks enterprise adoption; makes "self-hostable" legally ambiguous.
- `embed.go` `//go:embed web/dist/*`: cold `go build ./...` fails in fresh clones until the frontend is built (CI masks this).
- `penpot/` directory is empty (no design files exist).
- Hardcoded personal domain (`vaultkey.sheershjaiswal.in`) in Caddyfile/config — portable only for the owner.
- `skills-lock.json` pins third-party design-prompt skills — unrelated runtime tooling metadata at repo root.
- Self-imposed "<200 LoC/file" constraint already violated server-side too (`user_auth.go`, 224 lines).

---

## 7. Recommended priority order

**P0 — trust-breaking, days not weeks**
1. Remove `mock_sig_` bypass + derive plan server-side from persisted records (C3, C4)
2. Encrypt share payloads with the org key (C5)
3. Implement `POST /v1/vault/unlock` or repoint CLI to `/v1/auth/login` (C1); fix status auth-context (C2)
4. Refuse to boot with default HMAC signing key; generate random key with strict perms (C6)
5. Add authz checks to rollback (H1); serialize audit-chain writes in a tx (H2)
6. Gate share-page reveal behind a click (H16); fix false TAMPERED state (H17); fix Use-Secret flow (C8)
7. Publish port on 127.0.0.1 only (H7)

**P1 — correctness**
8. Copy-on-Get for master key (H4); lost-update/version-guard on secrets (H3); rebuild Node dist + prepublishOnly (H11)
9. Timeouts/retries in all three clients (H10); switch export/run to batch endpoint; fix push exit codes
10. Default DB path to `/var/lib/vaultkey`, enforce auto-lock timer, honor VAULTKEY_PORT (H6, H15)
11. Atomic lockout counter, transactional signup, permission whitelists, pagination clamps, DSN-based PRAGMAs + raise max conns

**P2 — product completeness**
12. Team invites + role-derived sessions (replace blanket-admin logins) — requires envelope-encrypted org KEK design (H5)
13. Delete/edit UI, profile/settings, team management pages; filters/sort/pagination
14. Package Python SDK; decide Go SDK claim (publish internal/client or amend PRODUCT.md); document or drop Dart SDK
15. Webhook event processing + renewal sweep for subscriptions (or descope the claim)

**P3 — polish**
16. Modal/a11y primitives, focus-visible rings, contrast fixes, skeletons, responsive shell
17. LICENSE, lint in CI, checksummed releases, arm64 images, healthchecks, graceful shutdown, frontend tests
18. Reconcile all pricing copy; replace emoji iconography with lucide; purge dead code

---
*Generated from four parallel deep-review passes over cmd/, internal/, sdk/, web/, installer/, .github/, and root configs. All findings carry file:line references verified against the working tree.*
