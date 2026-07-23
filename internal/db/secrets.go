package db

import (
	"database/sql"
	"errors"
	"time"
)

type Secret struct {
	ID          string    `json:"id"`
	OrgID       string    `json:"org_id"`
	Key         string    `json:"key"`
	Value       []byte    `json:"-"` // AES-256-GCM encrypted
	Project     string    `json:"project"`
	Environment string    `json:"environment"`
	Version     int       `json:"version"`
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (db *DB) CreateSecret(s Secret) error {
	query := `
		INSERT INTO secrets (id, org_id, key, value, project, environment, version, created_by, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`
	_, err := db.Exec(query, s.ID, s.OrgID, s.Key, s.Value, s.Project, s.Environment, s.CreatedBy)
	return err
}

func (db *DB) GetSecret(orgID, project, environment, key string) (*Secret, error) {
	var s Secret
	query := `
		SELECT id, org_id, key, value, project, environment, version, created_by, created_at, updated_at
		FROM secrets
		WHERE org_id = ? AND project = ? AND environment = ? AND key = ?
	`
	err := db.QueryRow(query, orgID, project, environment, key).Scan(
		&s.ID, &s.OrgID, &s.Key, &s.Value, &s.Project, &s.Environment, &s.Version, &s.CreatedBy, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &s, nil
}

func (db *DB) UpdateSecret(s Secret, oldSecret Secret, newVersionID string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec(`
		INSERT INTO secret_versions (id, secret_id, org_id, value, version, created_at)
		VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
	`, newVersionID, oldSecret.ID, oldSecret.OrgID, oldSecret.Value, oldSecret.Version)
	if err != nil {
		return err
	}

	_, err = tx.Exec(`
		UPDATE secrets
		SET value = ?, version = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND org_id = ?
	`, s.Value, s.Version, s.ID, s.OrgID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (db *DB) DeleteSecret(orgID, secretID string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec("DELETE FROM secret_versions WHERE secret_id = ? AND org_id = ?", secretID, orgID)
	if err != nil {
		return err
	}

	_, err = tx.Exec("DELETE FROM secrets WHERE id = ? AND org_id = ?", secretID, orgID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (db *DB) GetSecretVersions(secretID string) ([]Secret, error) {
	rows, err := db.Query(`
		SELECT id, secret_id, org_id, value, version, created_at
		FROM secret_versions
		WHERE secret_id = ?
		ORDER BY version DESC
	`, secretID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Secret
	for rows.Next() {
		var s Secret
		var secID string
		err := rows.Scan(&s.ID, &secID, &s.OrgID, &s.Value, &s.Version, &s.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, nil
}

func (db *DB) ListSecrets(orgID, project, environment string) ([]Secret, error) {
	rows, err := db.Query(`
		SELECT id, org_id, key, project, environment, version, created_by, created_at, updated_at
		FROM secrets
		WHERE org_id = ? AND project = ? AND environment = ?
		ORDER BY key ASC
	`, orgID, project, environment)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Secret
	for rows.Next() {
		var s Secret
		err := rows.Scan(&s.ID, &s.OrgID, &s.Key, &s.Project, &s.Environment, &s.Version, &s.CreatedBy, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, nil
}

func (db *DB) ListSecretsWithValues(orgID, project, environment string) ([]Secret, error) {
	rows, err := db.Query(`
		SELECT id, org_id, key, value, project, environment, version, created_by, created_at, updated_at
		FROM secrets
		WHERE org_id = ? AND project = ? AND environment = ?
		ORDER BY key ASC
	`, orgID, project, environment)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Secret
	for rows.Next() {
		var s Secret
		err := rows.Scan(&s.ID, &s.OrgID, &s.Key, &s.Value, &s.Project, &s.Environment, &s.Version, &s.CreatedBy, &s.CreatedAt, &s.UpdatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, s)
	}
	return list, nil
}

func (db *DB) CountSecrets(orgID string) (int, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM secrets WHERE org_id = ?", orgID).Scan(&count)
	return count, err
}

func (db *DB) ListProjects(orgID string) ([]string, error) {
	rows, err := db.Query("SELECT DISTINCT project FROM secrets WHERE org_id = ? ORDER BY project ASC", orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []string
	for rows.Next() {
		var p string
		if err := rows.Scan(&p); err != nil {
			return nil, err
		}
		list = append(list, p)
	}

	hasDefault := false
	for _, p := range list {
		if p == "default" {
			hasDefault = true
			break
		}
	}
	if !hasDefault {
		list = append([]string{"default"}, list...)
	}
	return list, nil
}
