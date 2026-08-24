package db

import (
	"database/sql"
	"fmt"
	"time"
)

type Organization struct {
	ID                 string     `json:"id"`
	Name               string     `json:"name"`
	Slug               string     `json:"slug"`
	Argon2Salt         string     `json:"-"`
	Sentinel           string     `json:"-"`
	KeyScheme          string     `json:"-"`
	Plan               string     `json:"plan"`
	SubscriptionID     *string    `json:"subscription_id,omitempty"`
	SubscriptionStatus string     `json:"subscription_status"`
	CurrentPeriodEnd   *time.Time `json:"current_period_end,omitempty"`
	CreatedAt          time.Time  `json:"created_at"`
}

func (db *DB) CreateOrganization(org Organization) error {
	query := `
		INSERT INTO organizations (id, name, slug, argon2_salt, sentinel, key_scheme, plan)
		VALUES (?, ?, ?, ?, ?, ?, ?);
	`
	scheme := org.KeyScheme
	if scheme == "" {
		scheme = "envelope"
	}
	_, err := db.Exec(query, org.ID, org.Name, org.Slug, org.Argon2Salt, org.Sentinel, scheme, org.Plan)
	if err != nil {
		return fmt.Errorf("failed to create organization: %w", err)
	}
	return nil
}

func (db *DB) CreateOrgWithFounderTx(org Organization, user User, wrap KeyWrap) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	scheme := org.KeyScheme
	if scheme == "" {
		scheme = "envelope"
	}
	if _, err := tx.Exec(
		`INSERT INTO organizations (id, name, slug, argon2_salt, sentinel, key_scheme, plan) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		org.ID, org.Name, org.Slug, org.Argon2Salt, org.Sentinel, scheme, org.Plan,
	); err != nil {
		return fmt.Errorf("failed to create organization: %w", err)
	}
	if _, err := tx.Exec(
		`INSERT INTO users (id, org_id, email, password_hash, role, failed_attempts, locked_until) VALUES (?, ?, ?, ?, ?, 0, NULL)`,
		user.ID, user.OrgID, user.Email, user.PasswordHash, user.Role,
	); err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	if wrap.UserID != "" {
		if _, err := tx.Exec(
			`INSERT INTO key_wraps (org_id, user_id, wrapped_key, wrap_salt, kdf_params) VALUES (?, ?, ?, ?, ?)`,
			wrap.OrgID, wrap.UserID, wrap.WrappedKey, wrap.WrapSalt, wrap.KDFParams,
		); err != nil {
			return fmt.Errorf("failed to store key wrap: %w", err)
		}
	}
	return tx.Commit()
}

func orgScanColumns() string {
	return `id, name, slug, argon2_salt, sentinel, COALESCE(key_scheme, 'legacy'), plan, subscription_id, subscription_status, current_period_end, created_at`
}

func scanOrganization(row *sql.Row) (*Organization, error) {
	var org Organization
	var subID *string
	var subStatus string
	var periodEnd *time.Time
	err := row.Scan(&org.ID, &org.Name, &org.Slug, &org.Argon2Salt, &org.Sentinel, &org.KeyScheme, &org.Plan, &subID, &subStatus, &periodEnd, &org.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	org.SubscriptionID = subID
	org.SubscriptionStatus = subStatus
	org.CurrentPeriodEnd = periodEnd
	return &org, nil
}

func (db *DB) GetOrganizationByID(id string) (*Organization, error) {
	row := db.QueryRow(`SELECT `+orgScanColumns()+` FROM organizations WHERE id = ?;`, id)
	org, err := scanOrganization(row)
	if err != nil {
		return nil, fmt.Errorf("failed to get org by id: %w", err)
	}
	return org, nil
}

func (db *DB) GetOrganizationBySlug(slug string) (*Organization, error) {
	row := db.QueryRow(`SELECT `+orgScanColumns()+` FROM organizations WHERE slug = ?;`, slug)
	org, err := scanOrganization(row)
	if err != nil {
		return nil, fmt.Errorf("failed to get org by slug: %w", err)
	}
	return org, nil
}

func (db *DB) UpdateOrganizationPlan(id string, plan string) error {
	query := `UPDATE organizations SET plan = ? WHERE id = ?;`
	_, err := db.Exec(query, plan, id)
	if err != nil {
		return fmt.Errorf("failed to update org plan: %w", err)
	}
	return nil
}

func (db *DB) SetOrgKeyScheme(id, scheme string) error {
	_, err := db.Exec(`UPDATE organizations SET key_scheme = ? WHERE id = ?`, scheme, id)
	if err != nil {
		return fmt.Errorf("failed to update key scheme: %w", err)
	}
	return nil
}
