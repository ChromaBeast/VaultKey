package db

import (
	"database/sql"
	"fmt"
	"time"
)

type Subscription struct {
	ID            string
	OrgID         string
	RazorpaySubID string
	Plan          string
	Status        string
	CreatedAt     time.Time
}

func (db *DB) CreateSubscriptionRecord(s Subscription) error {
	query := `
		INSERT INTO subscriptions (id, org_id, razorpay_sub_id, plan, status)
		VALUES (?, ?, ?, ?, ?);
	`
	_, err := db.Exec(query, s.ID, s.OrgID, s.RazorpaySubID, s.Plan, s.Status)
	if err != nil {
		return fmt.Errorf("failed to create subscription record: %w", err)
	}
	return nil
}

func (db *DB) GetSubscriptionByRazorpayID(rzpSubID string) (*Subscription, error) {
	var s Subscription
	query := `SELECT id, org_id, razorpay_sub_id, plan, status, created_at FROM subscriptions WHERE razorpay_sub_id = ?;`
	err := db.QueryRow(query, rzpSubID).Scan(&s.ID, &s.OrgID, &s.RazorpaySubID, &s.Plan, &s.Status, &s.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get subscription: %w", err)
	}
	return &s, nil
}

func (db *DB) SetSubscriptionStatus(id, status string) error {
	_, err := db.Exec(`UPDATE subscriptions SET status = ? WHERE id = ?`, status, id)
	return err
}

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
	row := db.QueryRow(`SELECT `+orgScanColumns()+` FROM organizations WHERE subscription_id = ?;`, subID)
	org, err := scanOrganization(row)
	if err != nil {
		return nil, fmt.Errorf("failed to get org by subscription id: %w", err)
	}
	return org, nil
}

func (db *DB) RecordWebhookEvent(eventID string) (bool, error) {
	res, err := db.Exec(`INSERT OR IGNORE INTO webhook_events (event_id) VALUES (?)`, eventID)
	if err != nil {
		return false, fmt.Errorf("failed to record webhook event: %w", err)
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

func (db *DB) DowngradeExpiredSubscriptions(now time.Time) ([]string, error) {
	rows, err := db.Query(`
		UPDATE organizations
		SET plan = 'free', subscription_status = 'expired'
		WHERE plan != 'free'
		  AND current_period_end IS NOT NULL
		  AND current_period_end < ?
		  AND subscription_status IN ('active', 'past_due')
		RETURNING id;
	`, now)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}
