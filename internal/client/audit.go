package client

import (
	"fmt"
	"time"
)

// AuditLogHeader represents audit log metadata returned from the server.
type AuditLogHeader struct {
	ID        string    `json:"id"`
	Action    string    `json:"action"`
	SecretKey *string   `json:"secret_key"`
	Project   *string   `json:"project"`
	Actor     string    `json:"actor"`
	IPAddress *string   `json:"ip_address"`
	UserAgent *string   `json:"user_agent"`
	HMAC      string    `json:"hmac"`
	CreatedAt time.Time `json:"created_at"`
}

// ListAuditLogs retrieves paginated secure logs.
func (c *Client) ListAuditLogs(limit, offset int) ([]AuditLogHeader, error) {
	var list []AuditLogHeader
	path := fmt.Sprintf("/v1/audit?limit=%d&offset=%d", limit, offset)
	err := c.request("GET", path, nil, &list)
	return list, err
}

// VerifyAuditChain checks the integrity of the whole audit log chain.
func (c *Client) VerifyAuditChain() (bool, int, error) {
	var res struct {
		Verified bool `json:"verified"`
		Count    int  `json:"count"`
	}
	err := c.request("GET", "/v1/audit/verify", nil, &res)
	if err != nil {
		return false, 0, err
	}
	return res.Verified, res.Count, nil
}
