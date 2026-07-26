CREATE TABLE IF NOT EXISTS organizations (
    id                  TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    argon2_salt         TEXT NOT NULL,
    sentinel            TEXT NOT NULL,
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
    org_id      TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,
    secret_key  TEXT,
    project     TEXT,
    actor       TEXT NOT NULL,
    ip_address  TEXT,
    user_agent  TEXT,
    hmac        TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_secrets_org ON secrets(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_org_created ON audit_log(org_id, created_at);

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

CREATE INDEX IF NOT EXISTS idx_payments_org ON payments(org_id);


