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
	Plan               string     `json:"plan"`
	SubscriptionID     *string    `json:"subscription_id,omitempty"`
	SubscriptionStatus string     `json:"subscription_status"`
	CurrentPeriodEnd   *time.Time `json:"current_period_end,omitempty"`
	CreatedAt          time.Time  `json:"created_at"`
}

func (db *DB) CreateOrganization(org Organization) error {
	query := `
		INSERT INTO organizations (id, name, slug, argon2_salt, sentinel, plan)
		VALUES (?, ?, ?, ?, ?, ?);
	`
	_, err := db.Exec(query, org.ID, org.Name, org.Slug, org.Argon2Salt, org.Sentinel, org.Plan)
	if err != nil {
		return fmt.Errorf("failed to create organization: %w", err)
	}
	return nil
}

func (db *DB) GetOrganizationByID(id string) (*Organization, error) {
	query := `SELECT id, name, slug, argon2_salt, sentinel, plan, subscription_id, subscription_status, current_period_end, created_at FROM organizations WHERE id = ?;`
	row := db.QueryRow(query, id)

	var org Organization
	var subID *string
	var subStatus string
	var periodEnd *time.Time
	err := row.Scan(&org.ID, &org.Name, &org.Slug, &org.Argon2Salt, &org.Sentinel, &org.Plan, &subID, &subStatus, &periodEnd, &org.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get org by id: %w", err)
	}
	org.SubscriptionID = subID
	org.SubscriptionStatus = subStatus
	org.CurrentPeriodEnd = periodEnd
	return &org, nil
}

func (db *DB) GetOrganizationBySlug(slug string) (*Organization, error) {
	query := `SELECT id, name, slug, argon2_salt, sentinel, plan, created_at FROM organizations WHERE slug = ?;`
	row := db.QueryRow(query, slug)

	var org Organization
	err := row.Scan(&org.ID, &org.Name, &org.Slug, &org.Argon2Salt, &org.Sentinel, &org.Plan, &org.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get org by slug: %w", err)
	}
	return &org, nil
}

func (db *DB) ListOrganizations() ([]Organization, error) {
	query := `SELECT id, name, slug, plan, created_at FROM organizations ORDER BY name ASC;`
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to list orgs: %w", err)
	}
	defer rows.Close()

	var orgs []Organization
	for rows.Next() {
		var o Organization
		if err := rows.Scan(&o.ID, &o.Name, &o.Slug, &o.Plan, &o.CreatedAt); err != nil {
			return nil, err
		}
		orgs = append(orgs, o)
	}
	return orgs, nil
}

func (db *DB) UpdateOrganizationPlan(id string, plan string) error {
	query := `UPDATE organizations SET plan = ? WHERE id = ?;`
	_, err := db.Exec(query, plan, id)
	if err != nil {
		return fmt.Errorf("failed to update org plan: %w", err)
	}
	return nil
}

