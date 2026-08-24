package client

// Status checks the locking state of the vault. Requires Authorization.
func (c *Client) Status() (bool, string, error) {
	var res struct {
		Locked  bool   `json:"locked"`
		Version string `json:"version"`
	}
	err := c.request("GET", "/v1/vault/status", nil, &res)
	return res.Locked, res.Version, err
}

// Unlock unlocks the vault with the account email and master password.
func (c *Client) Unlock(email, password string) error {
	body := map[string]string{"email": email, "password": password}
	return c.request("POST", "/v1/vault/unlock", body, nil)
}

// Lock locks the vault, clearing memory.
func (c *Client) Lock() error {
	return c.request("POST", "/v1/vault/lock", nil, nil)
}
