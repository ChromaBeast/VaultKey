package db

import (
	"database/sql"
	_ "embed"
	"fmt"

	_ "modernc.org/sqlite"
)

//go:embed schema.sql
var schemaSQL string

// DB wraps standard sql.DB to provide project-specific operations.
type DB struct {
	*sql.DB
}

// Open opens a connection to the SQLite database and executes the schema.
func Open(dataSourceName string) (*DB, error) {
	db, err := sql.Open("sqlite", dataSourceName)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite database: %w", err)
	}

	// Enable WAL mode, foreign keys, and 5s busy timeout for high concurrency safety
	if _, err := db.Exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;"); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to configure sqlite: %w", err)
	}
	db.SetMaxOpenConns(1)

	// Run migration schema
	if _, err := db.Exec(schemaSQL); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to execute schema: %w", err)
	}

	// Migrations for existing database schemas
	_, _ = db.Exec("ALTER TABLE organizations ADD COLUMN subscription_id TEXT;")
	_, _ = db.Exec("ALTER TABLE organizations ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'none';")
	_, _ = db.Exec("ALTER TABLE organizations ADD COLUMN current_period_end DATETIME;")
	_, _ = db.Exec("ALTER TABLE users ADD COLUMN failed_attempts INTEGER DEFAULT 0;")
	_, _ = db.Exec("ALTER TABLE users ADD COLUMN locked_until DATETIME;")

	return &DB{db}, nil
}
