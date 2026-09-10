package db

import (
	"database/sql"
	"errors"
	"time"
)

type Invite struct {
	Token     string    `json:"token"`
	OrgID     string    `json:"org_id"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedBy string    `json:"created_by"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

func (db *DB) CreateInvite(inv Invite) error {
	_, _ = db.Exec("DELETE FROM invites WHERE org_id = ? AND email = ?", inv.OrgID, inv.Email)
	query := `
		INSERT INTO invites (token, org_id, email, role, created_by, expires_at, created_at)
		VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
	`
	_, err := db.Exec(query, inv.Token, inv.OrgID, inv.Email, inv.Role, inv.CreatedBy, inv.ExpiresAt)
	return err
}

func (db *DB) GetInviteByToken(token string) (*Invite, error) {
	var inv Invite
	query := `SELECT token, org_id, email, role, created_by, expires_at, created_at FROM invites WHERE token = ?`
	err := db.QueryRow(query, token).Scan(
		&inv.Token, &inv.OrgID, &inv.Email, &inv.Role, &inv.CreatedBy, &inv.ExpiresAt, &inv.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	if time.Now().After(inv.ExpiresAt) {
		_, _ = db.Exec("DELETE FROM invites WHERE token = ?", token)
		return nil, errors.New("invitation has expired")
	}

	return &inv, nil
}

func (db *DB) DeleteInvite(token string) error {
	_, err := db.Exec("DELETE FROM invites WHERE token = ?", token)
	return err
}
