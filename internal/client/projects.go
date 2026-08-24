package client

// ListProjects retrieves the distinct project names visible to the token.
func (c *Client) ListProjects() ([]string, error) {
	var list []string
	err := c.request("GET", "/v1/projects", nil, &list)
	return list, err
}
