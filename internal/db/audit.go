package db

import (
	"database/sql"
	"errors"
	"time"
)

type AuditEntry struct {
	ID         string    `json:"id"`
	OrgID      string    `json:"org_id"`
	Action     string    `json:"action"`
	SecretKey  *string   `json:"secret_key"`
	Project    *string   `json:"project"`
	Actor      string    `json:"actor"`
	IPAddress  *string   `json:"ip_address"`
	UserAgent  *string   `json:"user_agent"`
	HMAC       string    `json:"hmac"`
	PrevHMAC   *string   `json:"prev_hmac,omitempty"`
	SignedAt   *string   `json:"signed_at,omitempty"`
	SigVersion int       `json:"sig_version"`
	CreatedAt  time.Time `json:"created_at"`
}

const auditColumns = `id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, prev_hmac, signed_at, COALESCE(sig_version, 1), created_at`

func scanAuditEntry(rows interface{ Scan(...any) error }) (AuditEntry, error) {
	var e AuditEntry
	var sigVersion int
	err := rows.Scan(&e.ID, &e.OrgID, &e.Action, &e.SecretKey, &e.Project, &e.Actor, &e.IPAddress, &e.UserAgent, &e.HMAC, &e.PrevHMAC, &e.SignedAt, &sigVersion, &e.CreatedAt)
	e.SigVersion = sigVersion
	return e, err
}

func (db *DB) CreateAuditEntry(e AuditEntry) error {
	query := `
		INSERT INTO audit_log (id, org_id, action, secret_key, project, actor, ip_address, user_agent, hmac, prev_hmac, signed_at, sig_version, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err := db.Exec(query, e.ID, e.OrgID, e.Action, e.SecretKey, e.Project, e.Actor, e.IPAddress, e.UserAgent, e.HMAC, e.PrevHMAC, e.SignedAt, e.SigVersion, e.CreatedAt)
	return err
}

func (db *DB) GetLastAuditEntry(orgID string) (*AuditEntry, error) {
	query := `SELECT ` + auditColumns + ` FROM audit_log WHERE org_id = ? ORDER BY rowid DESC LIMIT 1`
	row := db.QueryRow(query, orgID)
	e, err := scanAuditEntry(row)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (db *DB) ListAuditEntries(orgID string, limit, offset int, action, project string) ([]AuditEntry, error) {
	where := `WHERE org_id = @org`
	args := []any{sql.Named("org", orgID)}
	if action != "" {
		where += ` AND action = @action`
		args = append(args, sql.Named("action", action))
	}
	if project != "" {
		where += ` AND project = @project`
		args = append(args, sql.Named("project", project))
	}
	query := `SELECT ` + auditColumns + ` FROM audit_log ` + where + ` ORDER BY rowid DESC LIMIT @limit OFFSET @offset`
	args = append(args, sql.Named("limit", limit), sql.Named("offset", offset))

	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AuditEntry
	for rows.Next() {
		e, err := scanAuditEntry(rows)
		if err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, rows.Err()
}

func (db *DB) GetAllAuditEntries(orgID string) ([]AuditEntry, error) {
	query := `SELECT ` + auditColumns + ` FROM audit_log WHERE org_id = ? ORDER BY rowid ASC`
	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []AuditEntry
	for rows.Next() {
		e, err := scanAuditEntry(rows)
		if err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, rows.Err()
}
