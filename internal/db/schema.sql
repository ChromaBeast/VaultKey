CREATE TABLE IF NOT EXISTS organizations (
    id                  TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    argon2_salt         TEXT NOT NULL,
    sentinel            TEXT NOT NULL DEFAULT '',
    key_scheme          TEXT NOT NULL DEFAULT 'envelope',
    plan                TEXT NOT NULL DEFAULT 'free',
    subscription_id     TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'none',
    current_period_end  DATETIME,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY,
    org_id          TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'member',
    failed_attempts INTEGER DEFAULT 0,
    locked_until    DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS secrets (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key         TEXT NOT NULL,
    value       BLOB NOT NULL,
    project     TEXT NOT NULL DEFAULT 'default',
    environment TEXT NOT NULL DEFAULT 'production',
    version     INTEGER NOT NULL DEFAULT 1,
    created_by  TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(org_id, key, project, environment)
);

CREATE TABLE IF NOT EXISTS secret_versions (
    id          TEXT PRIMARY KEY,
    secret_id   TEXT NOT NULL REFERENCES secrets(id) ON DELETE CASCADE,
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    value       BLOB NOT NULL,
    version     INTEGER NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_keys (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    key_hash    TEXT NOT NULL UNIQUE,
    permissions TEXT NOT NULL DEFAULT 'read',
    project     TEXT,
    last_used   DATETIME,
    expires_at  DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    active      INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS audit_log (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    action      TEXT NOT NULL,
    secret_key  TEXT,
    project     TEXT,
    actor       TEXT NOT NULL,
    ip_address  TEXT,
    user_agent  TEXT,
    hmac        TEXT NOT NULL,
    prev_hmac   TEXT,
    signed_at   TEXT,
    sig_version INTEGER NOT NULL DEFAULT 2,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shared_secrets (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ciphertext  TEXT NOT NULL,
    view_count  INTEGER DEFAULT 0,
    max_views   INTEGER DEFAULT 1,
    expires_at  DATETIME NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhooks (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    events      TEXT NOT NULL DEFAULT 'secret.write,secret.delete',
    secret      TEXT,
    active      INTEGER DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id                  TEXT PRIMARY KEY,
    org_id              TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    razorpay_order_id   TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT,
    razorpay_signature  TEXT,
    amount              INTEGER NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'INR',
    status              TEXT NOT NULL DEFAULT 'created',
    plan                TEXT NOT NULL DEFAULT 'pro',
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id              TEXT PRIMARY KEY,
    org_id          TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    razorpay_sub_id TEXT NOT NULL UNIQUE,
    plan            TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'created',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS key_wraps (
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wrapped_key BLOB NOT NULL,
    wrap_salt   TEXT NOT NULL,
    kdf_params  TEXT NOT NULL DEFAULT '',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (org_id, user_id)
);

CREATE TABLE IF NOT EXISTS vault_config (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhook_events (
    event_id    TEXT PRIMARY KEY,
    received_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires ON api_keys(expires_at);
CREATE INDEX IF NOT EXISTS idx_secrets_org ON secrets(org_id);
CREATE INDEX IF NOT EXISTS idx_secrets_scope ON secrets(org_id, project, environment);
CREATE INDEX IF NOT EXISTS idx_secret_versions_secret ON secret_versions(secret_id);
CREATE INDEX IF NOT EXISTS idx_audit_org_created ON audit_log(org_id, created_at);
CREATE INDEX IF NOT EXISTS idx_shares_expires ON shared_secrets(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);
CREATE INDEX IF NOT EXISTS idx_payments_org ON payments(org_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(org_id);
