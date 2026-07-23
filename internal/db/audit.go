package db

import (
	"database/sql"
	"errors"
	"time"
)

type AuditEntry struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"org_id"`
	Action    string    `json:"action"`
	SecretKey *string   `json:"secret_key"`
	Project   *string   `json:"project"`
	Actor     string    `json:"actor"`
	IPAddress *string   `json:"ip_address"`
	UserAgent *string   `json:"user_agent"`
	HMAC      string    `json:"hmac"`
	CreatedAt time.Time `json:"created_at"`
}

func (db *DB) CreateAuditEntry(e AuditEntry) error {
	query := `
		INSERT INTO audit_log (id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err := db.Exec(query, e.ID, e.OrgID, e.Action, e.SecretKey, e.Project, e.Actor, e.IPAddress, e.UserAgent, e.HMAC, e.CreatedAt)
	return err
}

func (db *DB) GetLastAuditEntry(orgID string) (*AuditEntry, error) {
	var e AuditEntry
	query := `
		SELECT id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, created_at
		FROM audit_log
		WHERE org_id = ?
		ORDER BY rowid DESC
		LIMIT 1
	`
	err := db.QueryRow(query, orgID).Scan(
		&e.ID, &e.OrgID, &e.Action, &e.SecretKey, &e.Project, &e.Actor, &e.IPAddress, &e.UserAgent, &e.HMAC, &e.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &e, nil
}

func (db *DB) ListAuditEntries(orgID string, limit, offset int) ([]AuditEntry, error) {
	query := `
		SELECT id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, created_at
		FROM audit_log
		WHERE org_id = ?
		ORDER BY rowid DESC
		LIMIT ? OFFSET ?
	`
	rows, err := db.Query(query, orgID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AuditEntry
	for rows.Next() {
		var e AuditEntry
		err := rows.Scan(&e.ID, &e.OrgID, &e.Action, &e.SecretKey, &e.Project, &e.Actor, &e.IPAddress, &e.UserAgent, &e.HMAC, &e.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, nil
}

func (db *DB) GetAllAuditEntries(orgID string) ([]AuditEntry, error) {
	query := `
		SELECT id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, created_at
		FROM audit_log
		WHERE org_id = ?
		ORDER BY rowid ASC
	`
	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AuditEntry
	for rows.Next() {
		var e AuditEntry
		err := rows.Scan(&e.ID, &e.OrgID, &e.Action, &e.SecretKey, &e.Project, &e.Actor, &e.IPAddress, &e.UserAgent, &e.HMAC, &e.CreatedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, nil
}
