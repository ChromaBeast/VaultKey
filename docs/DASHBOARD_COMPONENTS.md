# VaultKey Dashboard UI Component Inventory & Refactor Blueprint

This document provides an exhaustive inventory of every authenticated dashboard component, screen, modal, and utility in VaultKey. It details what each component renders, the state it holds, the API endpoints it consumes, and how these pieces assemble into end-to-end features.

---

## 1. Global Shell & Navigation Architecture

```
App.tsx
 └── ProtectedRoute (guards unauthenticated sessions)
      └── AppLayout.tsx (Root Shell)
           ├── Sidebar.tsx (Desktop Navigation & Mobile Drawer)
           │    ├── Org Brand & Plan Badge
           │    ├── Navigation Links (/secrets, /keys, /audit, /billing, /settings, /docs)
           │    └── SidebarUserPanel.tsx (User info & "Lock Vault" trigger)
           ├── Main Content Area (<Outlet />)
           └── CommandPaletteModal.tsx (Global Cmd+K Spotlight Modal)
```

### Component Details

#### 1. `AppLayout.tsx` (`web/src/components/AppLayout.tsx`)
- **What it does**: Acts as the master responsive layout shell for all authenticated routes (`/secrets`, `/keys`, `/audit`, `/billing`, `/settings`).
- **Internal State & Listeners**:
  - `cmdOpen` (boolean): Controls visibility of `CommandPaletteModal`. Listens to `keydown` (`Cmd+K` / `Ctrl+K`) and custom window event `vk_cmd_open`.
  - `navOpen` (boolean): Controls mobile off-canvas drawer slide-in state.
- **Renders**:
  - `<Sidebar mobileOpen={navOpen} onMobileClose={() => setNavOpen(false)} />`
  - Backdrop button for mobile drawer dismissal.
  - Mobile hamburger toggle button (`Menu` icon).
  - Main scrollable content container (`<main className="app-main">`) wrapping `<Outlet />`.
  - Conditional `<CommandPaletteModal />`.

#### 2. `Sidebar.tsx` (`web/src/components/Sidebar.tsx`)
- **What it does**: Sticky vertical desktop sidebar (220px wide) and off-canvas mobile drawer.
- **Props**: `mobileOpen: boolean`, `onMobileClose: () => void`.
- **Context Consumed**: `useAuth()` (`org` object).
- **Renders**:
  - VaultKey logo icon + brand name.
  - Dynamic `PRO` pill badge if `org.plan === 'pro'`.
  - Active organization name (`org.name`).
  - Mobile close `X` button.
  - Primary navigation links (`NavLink` with active glowing state):
    - **Secrets** (`/secrets` - `Lock` icon)
    - **API Keys** (`/keys` - `KeyRound` icon)
    - **Audit Ledger** (`/audit` - `ScrollText` icon)
    - **Billing** (`/billing` - `CreditCard` icon)
    - **Settings** (`/settings` - `Settings` icon)
    - **Docs** (`/docs` - `BookOpen` icon)
  - `<SidebarUserPanel />` pinned at the bottom.

#### 3. `SidebarUserPanel.tsx` (`web/src/components/SidebarUserPanel.tsx`)
- **What it does**: Renders the logged-in user's identity card and primary emergency action.
- **Context Consumed**: `useAuth()` (`user`, `lockVault()`).
- **Renders**:
  - Circular avatar with 2-letter uppercase initials derived from email (`email.substring(0, 2)`).
  - Truncated user email address.
  - User organization role badge (`admin`, `write`, `read`).
  - **"Lock Vault"** button: Calls `lockVault()` (`POST /v1/vault/lock`), which wipes cryptographic keys in server RAM, purges `localStorage` (`vk_token`, `vk_user`, `vk_org`), and redirects to `/login`.

#### 4. `CommandPaletteModal.tsx` (`web/src/components/CommandPaletteModal.tsx`)
- **What it does**: Spotlight-style command bar triggered anywhere via `Cmd+K` / `Ctrl+K`.
- **Props**: `isOpen: boolean`, `onClose: () => void`, `onOpenCreateSecret?: () => void`.
- **Keyboard Traversal**: Full `ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`, and `Escape` support with ARIA combobox accessibility.
- **Registered Commands**:
  - `Actions`: "Create New Secret" (triggers secret creation modal).
  - `Navigation`: Direct routing to `/secrets`, `/keys`, `/audit`, `/billing`, `/settings`, `/docs`.
  - `Security`: "Zero Memory & Lock Vault Immediately" (calls `lockVault()`).

---

## 2. Screen 1: Secrets Vault (`/secrets`)

**File**: `web/src/pages/SecretsPage.tsx`  
**Purpose**: Primary application interface for zero-knowledge encrypted secret management. Provides project-scoped organization, real-time client-side search, masked viewing, in-memory decryption, version tracking with 1-click rollback, ephemeral one-time sharing links, and high-entropy secret generation.

```
SecretsPage.tsx
 ├── SecretsHeaderBar.tsx (Title, Secret count badge, Search input, Project selector, Action buttons)
 ├── BentoGridMetrics.tsx (Encrypted secrets count, Active project, Encryption algorithm, Cmd+K quick launcher)
 ├── SecretsTable.tsx (Secret rows, Key name, Project, Version tag, Last updated, Action buttons)
 └── SecretsModals.tsx (Modal orchestrator)
      ├── CreateSecretModal.tsx (Create new secret or edit existing value)
      ├── RevealSecretModal.tsx (Decrypted RAM display, Clipboard copy, One-time share link creator)
      ├── SecretVersionHistoryModal.tsx (Immutable version audit list & rollback trigger)
      ├── SecretGeneratorModal.tsx (High-entropy random string generator with length/character toggles)
      └── DeleteSecretDialog.tsx (Double-confirmation deletion dialog)
```

### Component Breakdown & State

| Component | Responsibility & UI State | User Actions & Events |
|---|---|---|
| `SecretsHeaderBar.tsx` | Search query filter, project selector dropdown, action triggers. | Updates `search` query; changes active `project`; clicks "Generator"; clicks "New Secret". |
| `BentoGridMetrics.tsx` | 4-card metric overview displaying total secrets in project, available project environments, encryption standard (`AES-256-GCM / Argon2id`), and quick Cmd+K action card. | Click Cmd+K card dispatches `vk_cmd_open` event. |
| `SecretsTable.tsx` | Tabular display of secret metadata. Handles loading skeletons, empty project states, and no-search-results states. | Click **Reveal** (fetches plaintext); click **History** (opens versions); click **Edit** (pre-fills modal); click **Delete** (opens confirm). |
| `CreateSecretModal.tsx` | Dual-mode modal (`create` or `edit`). When editing, key name is locked read-only. Auto-formats key names to uppercase underscored snake_case (`DATABASE_URL`). | Submits key/value payload; clicks "Generator" shortcut to inject random string. |
| `RevealSecretModal.tsx` | Shows decrypted secret plaintext in isolated dark container (`#090d16`). Generates self-destructing share links. | Copies plaintext to clipboard; clicks "1-Time Link" to generate public self-destruct URL. |
| `SecretVersionHistoryModal.tsx` | Fetches chronological version list for a secret key. Shows version number, timestamp, and rollback button. | Clicks "Rollback to vN"; opens `ConfirmDialog` to confirm overwrite. |
| `SecretGeneratorModal.tsx` | Web Crypto API (`window.crypto.getRandomValues`) generator. Sliders for length (12-64 chars), checkboxes for numbers and symbols. | Re-generates random secret; copies to clipboard; clicks "Use Secret" to insert into create modal. |
| `DeleteSecretDialog.tsx` | Confirmation dialog with required typing confirmation (requires typing secret key name) to prevent accidental loss. | Confirms permanent deletion. |

### API Endpoints Used

| HTTP Method | Endpoint | Request Headers / Body | Response Schema | How Feature Uses It |
|---|---|---|---|---|
| `GET` | `/v1/secrets?project={proj}` | `Authorization: Bearer <token>` | `SecretItem[]`: `[{ id, key, project, env, version, created_by, updated_at }]` | Loads secret metadata table. Secret values are **never** returned in this list. |
| `GET` | `/v1/projects` | `Authorization: Bearer <token>` | `string[]`: `["default", "production", ...]` | Populates project selection dropdown in header. |
| `POST` | `/v1/secrets` | `{ key: string, value: string, project: string }` | `{ message: string }` | Encrypts payload server-side using AES-256-GCM under org KEK; stores encrypted ciphertext. |
| `GET` | `/v1/secrets/:key?project={proj}` | `Authorization: Bearer <token>` | `{ value: string }` | Ephemeral RAM reveal: decrypts ciphertext on server, returns plaintext value to client memory. |
| `PUT` | `/v1/secrets/:key?project={proj}` | `{ value: string, project: string }` | `{ message: string }` | Updates secret value, auto-increments version number, creates immutable version history entry. |
| `DELETE` | `/v1/secrets/:key?project={proj}` | `Authorization: Bearer <token>` | `void` (204 No Content) | Deletes secret record and logs deletion event in HMAC audit ledger. |
| `GET` | `/v1/secrets/:key/versions?project={proj}` | `Authorization: Bearer <token>` | `SecretVersionItem[]`: `[{ id, version, created_at }]` | Retrieves all historical versions for secret audit and rollback preview. |
| `POST` | `/v1/secrets/:key/rollback?project={proj}&version={v}` | `Authorization: Bearer <token>` | `{ message: string, version: number }` | Replaces current secret ciphertext with snapshot from historical version `v`. |
| `POST` | `/v1/shares` | `{ secret: string, max_views: 1, duration: "24h" }` | `{ share_url: string }` | Generates a 1-time self-destructing access URL (`/share/:id`) stored in Redis/DB. |

---

## 3. Screen 2: API Keys Management (`/keys`)

**File**: `web/src/pages/ApiKeysPage.tsx`  
**Purpose**: Issues and manages scoped machine access tokens for developers, CLI (`vk pull`, `vk run`), GitHub Actions CI/CD pipelines, and SDK integrations without sharing human login credentials.

```
ApiKeysPage.tsx
 ├── StatCard.tsx (Active tokens count, Plan limit indicator, HMAC-SHA256 badge)
 ├── API Keys Table (Label, Token ID prefix, RBAC scope, Last used timestamp, Created date, Status, Revoke)
 ├── CreateApiKeyModal.tsx (Name input, Role scope selector: read / write / admin)
 ├── TokenCreatedModal.tsx (One-time raw token disclosure dialog with copy button)
 └── ConfirmDialog.tsx (Confirmation modal before revoking key)
```

### Component Breakdown & State

| Component | Responsibility & UI State | User Actions & Events |
|---|---|---|
| `StatCard.tsx` (x3) | Displays: (1) Active Tokens count, (2) Plan Quota Limit (`active / 2` on Free tier or `Unlimited` on Pro), (3) Security architecture (`HMAC-SHA256`). | Read-only metric indicators. |
| Keys Table | Displays list of issued tokens with status badge (`Active` or `Revoked`). | Clicking "Revoke" opens confirmation modal. |
| `CreateApiKeyModal.tsx` | Collects key label name (e.g. `github-actions-ci`) and permission level (`read`, `write`, `admin`). | Form submission calls API. |
| `TokenCreatedModal.tsx` | Critical security modal: Displays raw plaintext token (`vk_live_...`). Informs user that this token will never be displayed again. | Click "Copy Token" copies to clipboard; dismisses modal. |
| `ConfirmDialog.tsx` | Guards accidental key revocation; warns that CI/CD pipelines using this key will immediately fail. | Confirms revocation. |

### API Endpoints Used

| HTTP Method | Endpoint | Request Headers / Body | Response Schema | How Feature Uses It |
|---|---|---|---|---|
| `GET` | `/v1/api-keys` | `Authorization: Bearer <token>` | `APIKeyItem[]`: `[{ id, name, permissions, last_used, created_at, active }]` | Fetches active and revoked keys. Returns hashed token IDs, never raw secrets. |
| `POST` | `/v1/api-keys` | `{ name: string, permissions: "read" \| "write" \| "admin" }` | `{ token: string }` | Generates cryptographically secure random token, hashes with SHA-256 for DB storage, returns raw token string **once**. |
| `DELETE` | `/v1/api-keys/:id` | `Authorization: Bearer <token>` | `void` (204 No Content) | Immediately revokes key in DB; subsequent API requests with this token fail with 401 Unauthorized. |

---

## 4. Screen 3: Tamper-Evident Audit Ledger (`/audit`)

**File**: `web/src/pages/AuditPage.tsx`  
**Purpose**: Zero-trust compliance and observability. Every secret access, modification, key generation, and vault locking event is cryptographically signed into an append-only HMAC-SHA256 blockchain-style ledger.

```
AuditPage.tsx
 ├── Integrity Status Banner (Live HMAC chain status: Checking / Verified / Tampered)
 ├── StatCard.tsx (Total Events count, Ledger Type: HMAC Chain, Chain Integrity Status)
 ├── AuditPaginationBar.tsx (Action filter dropdown, Project filter input, Limit selector, Page offset, CSV export)
 └── Audit Table (Action pill, Secret key, Project, Actor user/key ID, Client IP, ISO timestamp, HMAC hash)
```

### Component Breakdown & State

| Component | Responsibility & UI State | User Actions & Events |
|---|---|---|
| Chain Integrity Banner | Shows whether HMAC chain is cryptographically intact (`#10b981`) or tampered (`#ef4444`). | Includes "Retry verification" button if verification call fails or detects anomaly. |
| `StatCard.tsx` (x3) | Displays: (1) Total loaded events count, (2) Ledger Type (`HMAC Chain`), (3) Cryptographic status (`Valid`, `Checking`, `Tampered`). | Read-only indicators. |
| `AuditPaginationBar.tsx` | Filter bar: Action filter (`WRITE`, `READ`, `DELETE`, `ROLLBACK`, `BATCH_READ`, `LOCK`), project search filter, row limit selector (50, 100), pagination prev/next. | Changing filters resets `offset` to 0 and re-fetches; clicking "Export CSV" triggers browser download. |
| Audit Table | High-density compliance log table displaying action badge, affected key, project scope, actor ID, client IP, timestamp, and truncated cryptographic HMAC hash. | Hovering over truncated secret keys or HMAC hashes shows full string in browser tooltip. |
| `auditCsv.ts` | Formats the loaded audit items into an RFC-compliant CSV with sanitized fields and triggers client-side file save (`vaultkey-audit-YYYY-MM-DD.csv`). | Client-side export helper. |

### API Endpoints Used

| HTTP Method | Endpoint | Request Headers / Body | Response Schema | How Feature Uses It |
|---|---|---|---|---|
| `GET` | `/v1/audit?action={act}&project={proj}&limit={n}&offset={m}` | `Authorization: Bearer <token>` | `AuditItem[]`: `[{ id, action, secret_key, project, actor, ip_address, hmac, prev_hmac, created_at }]` | Fetches filtered, paginated audit records for table rendering. |
| `GET` | `/v1/audit/verify` | `Authorization: Bearer <token>` | `{ verified: boolean }` | Traverses the entire cryptographic ledger from genesis hash to head, recalculating HMACs and link pointers. Returns `true` if 100% untampered. |

---

## 5. Screen 4: Team Plans & Billing (`/billing`)

**File**: `web/src/pages/BillingPage.tsx`  
**Purpose**: Subscription and payment management using Razorpay AutoPay for recurring monthly subscriptions (UPI AutoPay / Credit / Debit cards) and invoice payment tracking.

```
BillingPage.tsx
 ├── Active Subscription Banner (Subscription ID, Current Status, Auto-Renewal Date, Cancel Button)
 ├── Pricing Plan Cards (3-tier comparison: Free Starter, Pro Team, Enterprise Custom)
 │    ├── Free Starter Card ($0/mo, 25 secrets, 2 API keys)
 │    ├── Pro Team Card (₹1,499 / $19/mo, RazorpayCheckoutButton)
 │    └── Enterprise Card (Contact Sales mailto)
 └── PaymentHistoryTable.tsx (Payment invoices, Razorpay payment IDs, dates, amounts, status)
```

### Component Breakdown & State

| Component | Responsibility & UI State | User Actions & Events |
|---|---|---|
| Active Subscription Banner | Renders when `org.subscription_id` is present. Displays status badge (`active`, `past_due`, `canceled`) and renewal date. | Contains `<CancelSubscriptionButton />`. |
| `RazorpayCheckoutButton.tsx` | Dynamically loads `checkout.razorpay.com/v1/checkout.js`, initializes recurring AutoPay checkout modal with theme matching `#0b0e14`. | Clicks button -> calls `/v1/subscriptions/create` -> opens Razorpay modal -> on success calls `/v1/subscriptions/verify` -> updates user org state. |
| `CancelSubscriptionButton.tsx` | Calls backend to cancel subscription at period end; prompts confirmation dialog before action. | Clicks cancel -> confirms in dialog -> dispatches cancellation API. |
| `PaymentHistoryTable.tsx` | Tabular display of past billing transactions: invoice ID, plan name, amount (₹/USD), payment date, status (`captured`, `refunded`, `failed`). | Read-only ledger. |

### API Endpoints Used

| HTTP Method | Endpoint | Request Headers / Body | Response Schema | How Feature Uses It |
|---|---|---|---|---|
| `POST` | `/v1/subscriptions/create` | `{ plan: "pro" }` | `{ subscription_id: string, key_id: string, plan: string }` | Generates a recurring subscription plan in Razorpay and returns the checkout configuration. |
| `POST` | `/v1/subscriptions/verify` | `{ razorpay_subscription_id, razorpay_payment_id, razorpay_signature, plan }` | `{ message: string, status: string, org: Org }` | Verifies cryptographic signature from Razorpay checkout callback; promotes org to Pro immediately. |
| `POST` | `/v1/subscriptions/cancel` | `Authorization: Bearer <token>` | `{ message: string, org: Org }` | Cancels recurring AutoPay subscription in Razorpay; updates DB record. |
| `GET` | `/v1/payments/history` | `Authorization: Bearer <token>` | `PaymentRecord[]`: `[{ id, order_id, payment_id, amount, currency, status, plan, created_at }]` | Fetches historical payments and invoice records. |

---

## 6. Screen 5: Settings & Team Access (`/settings`)

**File**: `web/src/pages/SettingsPage.tsx`  
**Purpose**: Account security configuration (Argon2id password rotation and cryptographic re-wrapping) and zero-knowledge team member invitation and role-based access management.

```
SettingsPage.tsx
 ├── PasswordChangeForm.tsx (Current password, new password, confirm password, session invalidation)
 └── TeamSection (Admin role-gated container)
      └── TeamAdminSection.tsx
           ├── Invite User Form (Email input, Role select: read / write / admin, Submit button)
           ├── One-Time Invite Link Card (Copyable /accept-invite?token=... banner)
           ├── Team Members Table (Email, Role chip, Created date, Remove user button)
           └── ConfirmDialog.tsx (Confirmation modal before removing team member)
```

### Component Breakdown & State

| Component | Responsibility & UI State | User Actions & Events |
|---|---|---|
| `PasswordChangeForm.tsx` | Password change form with strict client-side validation (minimum 8 chars, match check). | Submits password change -> re-wraps user master key under new Argon2id hash -> revokes other active sessions. |
| `TeamAdminSection.tsx` (Admin only) | Displays team member table and invite generator. Non-admins see an info banner stating admin privileges are required. | Submits email + role -> backend creates 7-day token -> displays one-time invite URL with 1-click clipboard copy button. |
| Team Members Table | Lists all users in organization with email, role badge, and removal button. | Clicking "Remove" opens `ConfirmDialog` to revoke vault access. |

### API Endpoints Used

| HTTP Method | Endpoint | Request Headers / Body | Response Schema | How Feature Uses It |
|---|---|---|---|---|
| `POST` | `/v1/account/password` | `{ current_password: string, new_password: string }` | `{}` (200 OK) | Re-derives Argon2id salt and key wrap for master key; revokes all existing sessions except current token. |
| `GET` | `/v1/users` | `Authorization: Bearer <token>` | `TeamUser[]`: `[{ id, email, role, created_at }]` | Fetches list of users belonging to the current organization. |
| `POST` | `/v1/users/invite` | `{ email: string, role: "read" \| "write" \| "admin" }` | `InviteResponse`: `{ token, invite_url, email, role, expires_at }` | Generates a 7-day cryptographically secure invite token and returns the `/accept-invite?token=inv_...` link. |
| `DELETE` | `/v1/users/:id` | `Authorization: Bearer <token>` | `void` (204 No Content) | Revokes user membership and deletes user account from organization. |

---

## 7. Global State, Event Bus & Security Lifecycle

### 1. `AuthContext.tsx`
- **State Stored**:
  - `user: User | null` (`id`, `org_id`, `email`, `role`)
  - `org: Org | null` (`id`, `name`, `slug`, `plan`, `subscription_id`, `subscription_status`, `current_period_end`)
  - `token: string | null` (Stored in `localStorage.vk_token`)
- **Core Methods**:
  - `login(email, password)` -> `POST /v1/auth/login`
  - `signup(email, password, orgName)` -> `POST /v1/auth/signup`
  - `lockVault()` -> `POST /v1/vault/lock` (Destroys server-side cached master keys in RAM, clears client storage, sets state null)
  - `logout()` -> Purges client session immediately.

### 2. Global Event Bus
- `vk_cmd_open`: Dispatched by metrics card or shortcut; listened to by `AppLayout` to open command palette.
- `vk_auth_unauthorized`: Dispatched by `apiFetch` whenever a `401 Unauthorized` response is intercepted; automatically evicts user state to `/login`.
- `vk_toast`: Dispatched by `pushToast(message, type)` to render floating notifications (`Toast.tsx`).

---

## 8. Summary of Potential UI/UX Refactor Opportunities

When deciding how to rework the Dashboard UI, the following high-impact areas are prime candidates for modernization:

1. **Information Density & Layout Hierarchy**:
   - The current dashboard uses card wraps with wide borders. Transitioning to a sleek **Swiss / Cyberpunk terminal** or **Linear-inspired dark UI** (clean dividers, subtle 1px border glows, refined monospaced typography) would elevate the developer tool aesthetic.
2. **Unified Action Header Across All Screens**:
   - Replace disconnected header styles with a consistent, shared `PageHeader` component featuring breadcrumbs, action buttons, and live environment indicators.
3. **Enhanced Secrets Experience**:
   - Add inline secret editing directly inside the table rather than opening a separate modal.
   - Introduce secret tagging (e.g. `frontend`, `database`, `stripe`) and multi-environment tabs (`development`, `staging`, `production`) beyond simple project names.
   - Add bulk actions (batch export, batch delete, batch project reassignment).
4. **Audit Log Modernization**:
   - Add visual diff viewing for `WRITE` and `ROLLBACK` audit events (showing what changed between versions).
   - Add real-time event streaming via SSE or WebSockets so audit entries appear live without manual page refresh.
5. **Strict Code Modularity Enforcement**:
   - In accordance with project rules, every newly refactored screen or component will remain strictly under **200 Lines of Code (LoC)**, utilizing subcomponents and custom hooks for all complex UI logic.
