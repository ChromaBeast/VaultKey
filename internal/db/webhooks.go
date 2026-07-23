package db

import (
	"time"
)

type Webhook struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"org_id"`
	URL       string    `json:"url"`
	Events    string    `json:"events"`
	Secret    *string   `json:"secret"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"created_at"`
}

func (db *DB) CreateWebhook(w Webhook) error {
	query := `
		INSERT INTO webhooks (id, org_id, url, events, secret, active, created_at)
		VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
	`
	_, err := db.Exec(query, w.ID, w.OrgID, w.URL, w.Events, w.Secret, w.Active)
	return err
}

func (db *DB) ListWebhooks(orgID string) ([]Webhook, error) {
	rows, err := db.Query("SELECT id, org_id, url, events, secret, active, created_at FROM webhooks WHERE org_id = ?", orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Webhook
	for rows.Next() {
		var w Webhook
		if err := rows.Scan(&w.ID, &w.OrgID, &w.URL, &w.Events, &w.Secret, &w.Active, &w.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, w)
	}
	return list, nil
}

func (db *DB) DeleteWebhook(orgID, id string) error {
	_, err := db.Exec("DELETE FROM webhooks WHERE id = ? AND org_id = ?", id, orgID)
	return err
}
