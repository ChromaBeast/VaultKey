package db

import (
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type PasswordReset struct {
	ID         string     `json:"id"`
	Email      string     `json:"email"`
	CodeHash   string     `json:"-"`
	Salt       string     `json:"-"`
	Attempts   int        `json:"attempts"`
	ResetToken *string    `json:"reset_token,omitempty"`
	ExpiresAt  time.Time  `json:"expires_at"`
	CreatedAt  time.Time  `json:"created_at"`
}

func (db *DB) CreatePasswordReset(id, email, codeHash, salt string, expiresAt time.Time) error {
	_, _ = db.Exec("DELETE FROM password_resets WHERE email = ?", email)
	query := `
		INSERT INTO password_resets (id, email, code_hash, salt, attempts, expires_at, created_at)
		VALUES (?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP)
	`
	_, err := db.Exec(query, id, email, codeHash, salt, expiresAt)
	if err != nil {
		return fmt.Errorf("failed to create password reset: %w", err)
	}
	return nil
}

func (db *DB) GetActiveResetByEmail(email string) (*PasswordReset, error) {
	var pr PasswordReset
	query := `
		SELECT id, email, code_hash, salt, attempts, reset_token, expires_at, created_at
		FROM password_resets
		WHERE email = ? AND expires_at > CURRENT_TIMESTAMP
		ORDER BY created_at DESC LIMIT 1
	`
	err := db.QueryRow(query, email).Scan(
		&pr.ID, &pr.Email, &pr.CodeHash, &pr.Salt, &pr.Attempts, &pr.ResetToken, &pr.ExpiresAt, &pr.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get active reset by email: %w", err)
	}
	return &pr, nil
}

func (db *DB) IncrementResetAttempts(id string) (int, error) {
	query := `UPDATE password_resets SET attempts = attempts + 1 WHERE id = ? RETURNING attempts`
	var newAttempts int
	err := db.QueryRow(query, id).Scan(&newAttempts)
	if err != nil {
		return 0, fmt.Errorf("failed to increment reset attempts: %w", err)
	}
	return newAttempts, nil
}

func (db *DB) SetResetToken(id, resetToken string) error {
	query := `UPDATE password_resets SET reset_token = ? WHERE id = ?`
	_, err := db.Exec(query, resetToken, id)
	if err != nil {
		return fmt.Errorf("failed to set reset token: %w", err)
	}
	return nil
}

func (db *DB) GetResetByToken(token string) (*PasswordReset, error) {
	var pr PasswordReset
	query := `
		SELECT id, email, code_hash, salt, attempts, reset_token, expires_at, created_at
		FROM password_resets
		WHERE reset_token = ? AND expires_at > CURRENT_TIMESTAMP
	`
	err := db.QueryRow(query, token).Scan(
		&pr.ID, &pr.Email, &pr.CodeHash, &pr.Salt, &pr.Attempts, &pr.ResetToken, &pr.ExpiresAt, &pr.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get reset by token: %w", err)
	}
	return &pr, nil
}

func (db *DB) DeleteReset(id string) error {
	_, err := db.Exec("DELETE FROM password_resets WHERE id = ?", id)
	return err
}
