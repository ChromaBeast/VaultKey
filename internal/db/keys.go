package db

import (
	"database/sql"
	"errors"
	"time"
)

type APIKey struct {
	ID          string     `json:"id"`
	OrgID       string     `json:"org_id"`
	Name        string     `json:"name"`
	KeyHash     string     `json:"-"`
	Permissions string     `json:"permissions"`
	Project     *string    `json:"project"`
	LastUsed    *time.Time `json:"last_used"`
	ExpiresAt   *time.Time `json:"expires_at"`
	CreatedAt   time.Time  `json:"created_at"`
	Active      bool       `json:"active"`
}

func (db *DB) CreateAPIKey(key APIKey) error {
	query := `
		INSERT INTO api_keys (id, org_id, name, key_hash, permissions, project, last_used, expires_at, created_at, active)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
	`
	_, err := db.Exec(query, key.ID, key.OrgID, key.Name, key.KeyHash, key.Permissions, key.Project, key.LastUsed, key.ExpiresAt, key.Active)
	return err
}

func (db *DB) FindAPIKeyByID(id string) (*APIKey, error) {
	var k APIKey
	query := `
		SELECT id, org_id, name, key_hash, permissions, project, last_used, expires_at, created_at, active
		FROM api_keys
		WHERE id = ?
	`
	err := db.QueryRow(query, id).Scan(
		&k.ID, &k.OrgID, &k.Name, &k.KeyHash, &k.Permissions, &k.Project, &k.LastUsed, &k.ExpiresAt, &k.CreatedAt, &k.Active,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &k, nil
}

func (db *DB) ListAPIKeys(orgID string) ([]APIKey, error) {
	rows, err := db.Query(`
		SELECT id, org_id, name, permissions, project, last_used, expires_at, created_at, active
		FROM api_keys
		WHERE org_id = ?
		ORDER BY created_at DESC
	`, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []APIKey
	for rows.Next() {
		var k APIKey
		err := rows.Scan(&k.ID, &k.OrgID, &k.Name, &k.Permissions, &k.Project, &k.LastUsed, &k.ExpiresAt, &k.CreatedAt, &k.Active)
		if err != nil {
			return nil, err
		}
		list = append(list, k)
	}
	return list, nil
}

func (db *DB) CountAPIKeys(orgID string) (int, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM api_keys WHERE org_id = ? AND active = 1", orgID).Scan(&count)
	return count, err
}

func (db *DB) UpdateKeyLastUsed(id string) error {
	_, err := db.Exec("UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE id = ?", id)
	return err
}

func (db *DB) RevokeAPIKey(orgID, id string) error {
	_, err := db.Exec("UPDATE api_keys SET active = 0 WHERE id = ? AND org_id = ?", id, orgID)
	return err
}
