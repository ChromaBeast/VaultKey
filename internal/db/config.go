package db

import (
	"database/sql"
	"errors"
)

// GetConfig retrieves a config value by key, returning empty string if not found.
func (db *DB) GetConfig(key string) (string, error) {
	var value string
	err := db.QueryRow("SELECT value FROM vault_config WHERE key = ?", key).Scan(&value)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", nil
		}
		return "", err
	}
	return value, nil
}

// SetConfig inserts or updates a configuration value.
func (db *DB) SetConfig(key, value string) error {
	_, err := db.Exec(`
		INSERT INTO vault_config (key, value)
		VALUES (?, ?)
		ON CONFLICT(key) DO UPDATE SET value = excluded.value
	`, key, value)
	return err
}
