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

func columnExists(d *sql.DB, table, column string) bool {
	rows, err := d.Query(fmt.Sprintf("PRAGMA table_info(%s)", table))
	if err != nil {
		return false
	}
	defer rows.Close()
	for rows.Next() {
		var cid int
		var name, ctype string
		var notNull int
		var dflt *string
		var pk int
		if err := rows.Scan(&cid, &name, &ctype, &notNull, &dflt, &pk); err != nil {
			return false
		}
		if name == column {
			return true
		}
	}
	return false
}

func addColumn(d *sql.DB, table, column, decl string) error {
	if columnExists(d, table, column) {
		return nil
	}
	_, err := d.Exec(fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s %s;", table, column, decl))
	if err != nil {
		return fmt.Errorf("add column %s.%s: %w", table, column, err)
	}
	return nil
}

func ensureLegacyColumns(d *sql.DB) error {
	if err := addColumn(d, "organizations", "subscription_id", "TEXT"); err != nil {
		return err
	}
	if err := addColumn(d, "organizations", "subscription_status", "TEXT NOT NULL DEFAULT 'none'"); err != nil {
		return err
	}
	if err := addColumn(d, "organizations", "current_period_end", "DATETIME"); err != nil {
		return err
	}
	if err := addColumn(d, "users", "failed_attempts", "INTEGER DEFAULT 0"); err != nil {
		return err
	}
	if err := addColumn(d, "users", "locked_until", "DATETIME"); err != nil {
		return err
	}
	return nil
}

func migrateAuditTable(d *sql.DB) error {
	hasOldFK := true
	rows, err := d.Query("SELECT sql FROM sqlite_master WHERE type='table' AND name='audit_log'")
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var ddl string
			if rows.Scan(&ddl) == nil && hasOldFK {
				hasOldFK = contains(ddl, "ON DELETE CASCADE")
			}
		}
	}
	if !hasOldFK {
		return nil
	}
	tx, err := d.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	stmts := []string{
		`CREATE TABLE audit_log_new (
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
			sig_version INTEGER NOT NULL DEFAULT 1,
			created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`INSERT INTO audit_log_new (id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, prev_hmac, signed_at, sig_version, created_at)
			SELECT id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, prev_hmac, signed_at, sig_version, created_at FROM audit_log`,
		`DROP TABLE audit_log`,
		`ALTER TABLE audit_log_new RENAME TO audit_log`,
	}
	for _, s := range stmts {
		if _, err := tx.Exec(s); err != nil {
			return fmt.Errorf("audit rebuild: %w", err)
		}
	}
	return tx.Commit()
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && searchString(s, sub)
}

func searchString(s, sub string) bool {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
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
