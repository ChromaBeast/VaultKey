package client

import "fmt"

// APIKeyResponse matches the server response for API key actions.
type APIKeyResponse struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Token       string  `json:"token"` // shown only once on creation
	Permissions string  `json:"permissions"`
	Project     *string `json:"project"`
	ExpiresAt   *string `json:"expires_at"`
	Active      bool    `json:"active"`
}

// CreateAPIKey generates a new authorization key.
func (c *Client) CreateAPIKey(name, permissions, project, expiresAt string) (*APIKeyResponse, error) {
	body := map[string]interface{}{
		"name":        name,
		"permissions": permissions,
		"project":     project,
		"expires_at":  expiresAt,
	}
	var res APIKeyResponse
	err := c.request("POST", "/v1/api-keys", body, &res)
	return &res, err
}

// ListAPIKeys retrieves metadata for all API keys.
func (c *Client) ListAPIKeys() ([]APIKeyResponse, error) {
	var list []APIKeyResponse
	err := c.request("GET", "/v1/api-keys", nil, &list)
	return list, err
}

// RevokeAPIKey revokes a key's active status.
func (c *Client) RevokeAPIKey(id string) error {
	path := fmt.Sprintf("/v1/api-keys/%s", id)
	return c.request("DELETE", path, nil, nil)
}
