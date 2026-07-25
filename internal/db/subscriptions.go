package db

import (
	"fmt"
	"time"
)

func (db *DB) UpdateOrgSubscription(orgID, plan, subID, subStatus string, periodEnd time.Time) error {
	query := `
		UPDATE organizations
		SET plan = ?, subscription_id = ?, subscription_status = ?, current_period_end = ?
		WHERE id = ?;
	`
	_, err := db.Exec(query, plan, subID, subStatus, periodEnd, orgID)
	if err != nil {
		return fmt.Errorf("failed to update org subscription: %w", err)
	}
	return nil
}

func (db *DB) UpdateOrgSubscriptionStatus(orgID, subStatus string) error {
	query := `UPDATE organizations SET subscription_status = ? WHERE id = ?;`
	_, err := db.Exec(query, subStatus, orgID)
	if err != nil {
		return fmt.Errorf("failed to update subscription status: %w", err)
	}
	return nil
}

func (db *DB) GetOrgBySubscriptionID(subID string) (*Organization, error) {
	query := `SELECT id, name, slug, argon2_salt, sentinel, plan, subscription_id, subscription_status, current_period_end, created_at FROM organizations WHERE subscription_id = ?;`
	row := db.QueryRow(query, subID)

	var org Organization
	var id *string
	var status string
	var periodEnd *time.Time
	err := row.Scan(&org.ID, &org.Name, &org.Slug, &org.Argon2Salt, &org.Sentinel, &org.Plan, &id, &status, &periodEnd, &org.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get org by subscription id: %w", err)
	}
	org.SubscriptionID = id
	org.SubscriptionStatus = status
	org.CurrentPeriodEnd = periodEnd
	return &org, nil
}
