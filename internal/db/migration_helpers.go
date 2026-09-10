package db

import (
	"database/sql"
	"fmt"
)

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
