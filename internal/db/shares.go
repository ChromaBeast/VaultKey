package db

import (
	"database/sql"
	"errors"
	"time"
)

type SharedSecret struct {
	ID         string    `json:"id"`
	OrgID      string    `json:"org_id"`
	Ciphertext string    `json:"ciphertext"`
	ViewCount  int       `json:"view_count"`
	MaxViews   int       `json:"max_views"`
	ExpiresAt  time.Time `json:"expires_at"`
	CreatedAt  time.Time `json:"created_at"`
}

func (db *DB) CreateSharedSecret(s SharedSecret) error {
	query := `
		INSERT INTO shared_secrets (id, org_id, ciphertext, view_count, max_views, expires_at, created_at)
		VALUES (?, ?, ?, 0, ?, ?, CURRENT_TIMESTAMP)
	`
	_, err := db.Exec(query, s.ID, s.OrgID, s.Ciphertext, s.MaxViews, s.ExpiresAt)
	return err
}

func (db *DB) GetSharedSecret(id string) (*SharedSecret, error) {
	var s SharedSecret
	query := `SELECT id, org_id, ciphertext, view_count, max_views, expires_at, created_at FROM shared_secrets WHERE id = ?`
	err := db.QueryRow(query, id).Scan(&s.ID, &s.OrgID, &s.Ciphertext, &s.ViewCount, &s.MaxViews, &s.ExpiresAt, &s.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	if time.Now().After(s.ExpiresAt) || s.ViewCount >= s.MaxViews {
		_, _ = db.Exec("DELETE FROM shared_secrets WHERE id = ?", id)
		return nil, errors.New("secret has expired or reached view limit")
	}

	return &s, nil
}

// ClaimSharedSecret atomically reserves one valid view and returns the payload.
// A competing request cannot claim the same final view.
func (db *DB) ClaimSharedSecret(id string) (*SharedSecret, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	now := time.Now()
	var s SharedSecret
	err = tx.QueryRow(`
		UPDATE shared_secrets
		SET view_count = view_count + 1
		WHERE id = ? AND view_count < max_views AND expires_at > ?
		RETURNING id, org_id, ciphertext, view_count, max_views, expires_at, created_at
	`, id, now).Scan(&s.ID, &s.OrgID, &s.Ciphertext, &s.ViewCount, &s.MaxViews, &s.ExpiresAt, &s.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if s.ViewCount >= s.MaxViews {
		if _, err := tx.Exec(`DELETE FROM shared_secrets WHERE id = ?`, id); err != nil {
			return nil, err
		}
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &s, nil
}
