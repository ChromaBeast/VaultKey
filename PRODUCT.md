# VaultKey — PRODUCT.md

## Platform
Web application + CLI + multi-language SDKs (Node.js, Python, Go).
Adaptive: the server is Docker-deployable SaaS; the CLI runs on developer machines;
SDKs inject secrets into process memory at runtime.

## Users & Their Situation

**Primary daily user — the backend developer / SRE:**
Mid-level to senior engineer at an Indian startup or mid-market tech company.
They are working inside a CI/CD pipeline, an on-call incident, or a local dev environment.
They need secrets to reach the right service without ever touching a .env file committed
to git, a plaintext secrets.json, or a third-party vault they don't control.

**Buyer / evaluator — the engineering lead or CTO:**
Technical decision-maker at a company with 5–100 engineers who has been burned by
a secrets leak, a compliance audit finding, or a HashiCorp Vault bill.
They are comparing VaultKey against Doppler, Infisical, and a self-hosted Vault.
They want proof the architecture is sound before onboarding the team.

## Product Purpose

VaultKey lets engineering teams store, rotate, and inject secrets without those secrets
ever touching disk in plaintext. The master key is derived fresh in RAM on each unlock
(Argon2id, 64 MB memory-hard), used to decrypt in memory, then zeroed. There is no
plaintext on disk at any point — not at rest, not in logs, not in backups.

## Positioning Line (the claim a competitor cannot truthfully copy without matching the architecture)

**"Your secrets never touch disk. Not ever. The master key lives only in RAM, derived
fresh on each unlock, and zeroed the moment the vault locks."**

This is architectural, not a marketing claim. It is verifiable in the source. It rules out
any competitor that writes secrets to a filesystem, a managed KMS blob, or an encrypted
database row at rest that is decrypted by a long-lived service key.

## Secondary Differentiators

1. **Immutable HMAC-chained audit ledger.** Every event is chained to the previous
   HMAC hash. Deleting or reordering any row breaks the chain. This is not a log —
   it is a cryptographic ledger. Suitable for SOC 2 and ISO 27001 evidence.

2. **India-first pricing via Razorpay.** ₹1,499 / month (~$19) with AutoPay (UPI,
   eNACH, card mandate). No USD billing friction for Indian engineering teams.

3. **`vaultkey run -- <cmd>` process injection.** Secrets are injected directly into
   the child process environment in memory. The parent process never writes them to
   a file. Works with any runtime.

## Operating Context

- Primary market: India (Razorpay, INR pricing). English-language interface.
- Self-hostable via Docker. No mandatory cloud dependency.
- Target compliance posture: SOC 2 Type II readiness, ISO 27001 alignment.
- Multi-tenant: orgs, projects, per-project API keys, role-based access (admin / write / read).

## Capabilities & Constraints

- Argon2id key derivation (time=3, memory=64MB, threads=4) — non-negotiable, in the core.
- AES-256-GCM per-secret encryption with random 12-byte nonce prepended.
- HMAC-SHA256 chained audit log — every entry references the previous entry's hash.
- Secret versioning with 1-click rollback.
- Self-destructing 1-time share links (max_views, TTL expiry).
- All source files < 200 LoC — enforced as a project constraint.

## Evidence on Hand

- Full zero-trust Argon2id + AES-256-GCM + memory-zeroing implementation shipped.
- Razorpay Recurring Subscription integration (AutoPay, UPI, eNACH) production-ready.
- HMAC-chained audit ledger with live verification endpoint.
- Docker deployment, Go CLI binary, Node.js + Python SDK stubs.
- Pre-launch: no external customer logos, no case studies, no press. Do not invent any.

## Design Principles

1. **Trust is earned through architecture, not copy.** Show the code, show the
   verification, show the audit chain. Don't claim "enterprise-grade" — demonstrate it.
2. **Quiet confidence.** Dark, precise, information-dense. Not loud. Not playful.
   The product is used during incidents and in security reviews, not for fun.
3. **Zero underlines.** Clean pill tabs, no link underlines anywhere.
4. **< 200 LoC per file.** Enforced at all times. New components, not big files.

## Accessibility

Standard WCAG AA contrast on all interactive text. Dark mode only.
No reduced-motion animations on the critical unlock flow.
