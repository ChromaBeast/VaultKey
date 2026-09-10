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

func (db *DB) ConsumeSharedSecret(id string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var viewCount, maxViews int
	err = tx.QueryRow(`SELECT view_count, max_views FROM shared_secrets WHERE id = ?`, id).Scan(&viewCount, &maxViews)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}
		return err
	}

	viewCount++
	if viewCount >= maxViews {
		_, _ = tx.Exec("DELETE FROM shared_secrets WHERE id = ?", id)
	} else {
		_, _ = tx.Exec("UPDATE shared_secrets SET view_count = ? WHERE id = ?", viewCount, id)
	}

	return tx.Commit()
}

func (db *DB) GetAndIncrementSharedSecret(id string) (*SharedSecret, error) {
	s, err := db.GetSharedSecret(id)
	if err != nil || s == nil {
		return nil, err
	}
	if err := db.ConsumeSharedSecret(id); err != nil {
		return nil, err
	}
	s.ViewCount++
	return s, nil
}

