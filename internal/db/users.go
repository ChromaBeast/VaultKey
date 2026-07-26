package db

import (
	"database/sql"
	"fmt"
	"time"
)

type User struct {
	ID             string     `json:"id"`
	OrgID          string     `json:"org_id"`
	Email          string     `json:"email"`
	PasswordHash   string     `json:"-"`
	Role           string     `json:"role"`
	FailedAttempts int        `json:"failed_attempts"`
	LockedUntil    *time.Time `json:"locked_until,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
}

func (db *DB) CreateUser(u User) error {
	query := `
		INSERT INTO users (id, org_id, email, password_hash, role, failed_attempts, locked_until)
		VALUES (?, ?, ?, ?, ?, 0, NULL);
	`
	_, err := db.Exec(query, u.ID, u.OrgID, u.Email, u.PasswordHash, u.Role)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (db *DB) GetUserByEmail(email string) (*User, error) {
	query := `SELECT id, org_id, email, password_hash, role, COALESCE(failed_attempts, 0), locked_until, created_at FROM users WHERE email = ?;`
	row := db.QueryRow(query, email)

	var u User
	err := row.Scan(&u.ID, &u.OrgID, &u.Email, &u.PasswordHash, &u.Role, &u.FailedAttempts, &u.LockedUntil, &u.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &u, nil
}

func (db *DB) GetUserByID(id string) (*User, error) {
	query := `SELECT id, org_id, email, password_hash, role, COALESCE(failed_attempts, 0), locked_until, created_at FROM users WHERE id = ?;`
	row := db.QueryRow(query, id)

	var u User
	err := row.Scan(&u.ID, &u.OrgID, &u.Email, &u.PasswordHash, &u.Role, &u.FailedAttempts, &u.LockedUntil, &u.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &u, nil
}

func (db *DB) RecordFailedLogin(userID string, maxAttempts int, lockoutDuration time.Duration) (int, bool, error) {
	user, err := db.GetUserByID(userID)
	if err != nil || user == nil {
		return 0, false, err
	}

	newCount := user.FailedAttempts + 1
	var lockedUntil *time.Time
	isLockedNow := false

	if newCount >= maxAttempts {
		until := time.Now().Add(lockoutDuration)
		lockedUntil = &until
		isLockedNow = true
	}

	query := `UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?;`
	_, err = db.Exec(query, newCount, lockedUntil, userID)
	if err != nil {
		return newCount, false, fmt.Errorf("failed to record failed login: %w", err)
	}

	return newCount, isLockedNow, nil
}

func (db *DB) ResetFailedLogins(userID string) error {
	query := `UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?;`
	_, err := db.Exec(query, userID)
	if err != nil {
		return fmt.Errorf("failed to reset failed logins: %w", err)
	}
	return nil
}

func (db *DB) ListUsersByOrg(orgID string) ([]User, error) {
	query := `SELECT id, org_id, email, role, created_at FROM users WHERE org_id = ? ORDER BY email ASC;`
	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.OrgID, &u.Email, &u.Role, &u.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}
