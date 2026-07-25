package db

import (
	"database/sql"
	"fmt"
	"time"
)

type SecretVersionItem struct {
	ID        string    `json:"id"`
	SecretID  string    `json:"secret_id"`
	OrgID     string    `json:"org_id"`
	Version   int       `json:"version"`
	CreatedAt time.Time `json:"created_at"`
}

func (db *DB) ListSecretVersions(orgID, secretID string) ([]SecretVersionItem, error) {
	query := `
		SELECT id, secret_id, org_id, version, created_at
		FROM secret_versions
		WHERE org_id = ? AND secret_id = ?
		ORDER BY version DESC;
	`
	rows, err := db.Query(query, orgID, secretID)
	if err != nil {
		return nil, fmt.Errorf("failed to list secret versions: %w", err)
	}
	defer rows.Close()

	var versions []SecretVersionItem
	for rows.Next() {
		var v SecretVersionItem
		if err := rows.Scan(&v.ID, &v.SecretID, &v.OrgID, &v.Version, &v.CreatedAt); err != nil {
			return nil, err
		}
		versions = append(versions, v)
	}
	return versions, nil
}

func (db *DB) GetSecretVersionValue(orgID, secretID string, version int) ([]byte, error) {
	query := `
		SELECT value FROM secret_versions
		WHERE org_id = ? AND secret_id = ? AND version = ?;
	`
	var val []byte
	err := db.QueryRow(query, orgID, secretID, version).Scan(&val)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get secret version value: %w", err)
	}
	return val, nil
}
