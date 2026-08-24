package db

import (
	"database/sql"
	"fmt"
)

type KeyWrap struct {
	OrgID      string
	UserID     string
	WrappedKey []byte
	WrapSalt   string
	KDFParams  string
}

func (db *DB) UpsertKeyWrap(w KeyWrap) error {
	query := `
		INSERT INTO key_wraps (org_id, user_id, wrapped_key, wrap_salt, kdf_params, updated_at)
		VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(org_id, user_id) DO UPDATE SET
			wrapped_key = excluded.wrapped_key,
			wrap_salt = excluded.wrap_salt,
			kdf_params = excluded.kdf_params,
			updated_at = CURRENT_TIMESTAMP
	`
	_, err := db.Exec(query, w.OrgID, w.UserID, w.WrappedKey, w.WrapSalt, w.KDFParams)
	if err != nil {
		return fmt.Errorf("failed to upsert key wrap: %w", err)
	}
	return nil
}

func (db *DB) GetKeyWrap(orgID, userID string) (*KeyWrap, error) {
	var w KeyWrap
	query := `SELECT org_id, user_id, wrapped_key, wrap_salt, COALESCE(kdf_params, '') FROM key_wraps WHERE org_id = ? AND user_id = ?`
	err := db.QueryRow(query, orgID, userID).Scan(&w.OrgID, &w.UserID, &w.WrappedKey, &w.WrapSalt, &w.KDFParams)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get key wrap: %w", err)
	}
	return &w, nil
}

func (db *DB) CountKeyWraps(orgID string) (int, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM key_wraps WHERE org_id = ?", orgID).Scan(&count)
	return count, err
}
