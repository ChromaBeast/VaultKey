package db

import (
	"database/sql"
	_ "embed"
	"fmt"
	"strings"

	_ "modernc.org/sqlite"
)

//go:embed schema.sql
var schemaSQL string

type DB struct {
	*sql.DB
}

const dsnPragmas = "_pragma=busy_timeout(5000)&_pragma=foreign_keys(1)&_pragma=journal_mode(WAL)"

func buildDSN(dataSourceName string) string {
	if strings.Contains(dataSourceName, "?") {
		return dataSourceName + "&" + dsnPragmas
	}
	return dataSourceName + "?" + dsnPragmas
}

func Open(dataSourceName string) (*DB, error) {
	db, err := sql.Open("sqlite", buildDSN(dataSourceName))
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite database: %w", err)
	}

	db.SetMaxOpenConns(4)

	if _, err := db.Exec(schemaSQL); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to execute schema: %w", err)
	}

	if err := runMigrations(db); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	return &DB{db}, nil
}
