package db

import (
	"database/sql"
	"fmt"
	"log"
)

type migration struct {
	version int
	fn      func(*sql.DB) error
}



var migrations = []migration{
	{version: 1, fn: ensureLegacyColumns},
	{version: 2, fn: func(d *sql.DB) error {
		return addColumn(d, "organizations", "key_scheme", "TEXT NOT NULL DEFAULT 'legacy'")
	}},
	{version: 3, fn: func(d *sql.DB) error {
		if err := addColumn(d, "audit_log", "prev_hmac", "TEXT"); err != nil {
			return err
		}
		if err := addColumn(d, "audit_log", "signed_at", "TEXT"); err != nil {
			return err
		}
		return addColumn(d, "audit_log", "sig_version", "INTEGER NOT NULL DEFAULT 1")
	}},
	{version: 4, fn: func(d *sql.DB) error {
		_, err := d.Exec(`
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
				event_id   TEXT PRIMARY KEY,
				received_at DATETIME DEFAULT CURRENT_TIMESTAMP
			);
			CREATE TABLE IF NOT EXISTS subscriptions (
				id              TEXT PRIMARY KEY,
				org_id          TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
				razorpay_sub_id TEXT NOT NULL UNIQUE,
				plan            TEXT NOT NULL,
				status          TEXT NOT NULL DEFAULT 'created',
				created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
			);
			CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(org_id);
		`)
		return err
	}},
	{version: 5, fn: func(d *sql.DB) error {
		_, err := d.Exec(`
			CREATE INDEX IF NOT EXISTS idx_secrets_scope ON secrets(org_id, project, environment);
			CREATE INDEX IF NOT EXISTS idx_secret_versions_secret ON secret_versions(secret_id);
			CREATE INDEX IF NOT EXISTS idx_shares_expires ON shared_secrets(expires_at);
			CREATE INDEX IF NOT EXISTS idx_api_keys_expires ON api_keys(expires_at);
			CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);
		`)
		return err
	}},
	{version: 6, fn: migrateAuditTable},
	{version: 7, fn: func(d *sql.DB) error {
		_, err := d.Exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_secret_versions_unique ON secret_versions(secret_id, version)")
		if err != nil {
			log.Printf("[migrate] unique version index skipped (duplicate history rows exist): %v", err)
			return nil
		}
		return nil
	}},
	{version: 8, fn: func(d *sql.DB) error {
		_, err := d.Exec(`
			CREATE TABLE IF NOT EXISTS invites (
				token      TEXT PRIMARY KEY,
				org_id     TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
				email      TEXT NOT NULL,
				role       TEXT NOT NULL,
				created_by TEXT NOT NULL,
				expires_at DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP
			);
			CREATE INDEX IF NOT EXISTS idx_invites_org_email ON invites(org_id, email);
			CREATE INDEX IF NOT EXISTS idx_invites_expires ON invites(expires_at);
		`)
		return err
	}},
}

func runMigrations(d *sql.DB) error {
	if _, err := d.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
		version INTEGER PRIMARY KEY,
		applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`); err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	for _, m := range migrations {
		var exists int
		err := d.QueryRow("SELECT COUNT(*) FROM schema_migrations WHERE version = ?", m.version).Scan(&exists)
		if err != nil {
			return err
		}
		if exists > 0 {
			continue
		}
		if err := m.fn(d); err != nil {
			return fmt.Errorf("migration %d failed: %w", m.version, err)
		}
		if _, err := d.Exec("INSERT INTO schema_migrations (version) VALUES (?)", m.version); err != nil {
			return err
		}
	}
	return nil
}
