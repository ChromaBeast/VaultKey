package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// Client handles communication with the VaultKey REST API.
type Client struct {
	BaseURL string
	Token   string
	Http    *http.Client
}

// NewClient initializes a client, pulling from environment variables by default.
func NewClient() *Client {
	url := os.Getenv("VAULTKEY_SERVER")
	if url == "" {
		url = "http://localhost:8080"
	}
	token := os.Getenv("VAULTKEY_TOKEN")
	return &Client{
		BaseURL: url,
		Token:   token,
		Http:    &http.Client{},
	}
}

func (c *Client) request(method, path string, body interface{}, response interface{}) error {
	var bodyBuf *bytes.Buffer
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return err
		}
		bodyBuf = bytes.NewBuffer(data)
	} else {
		bodyBuf = bytes.NewBuffer(nil)
	}

	req, err := http.NewRequest(method, c.BaseURL+path, bodyBuf)
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	if c.Token != "" {
		req.Header.Set("Authorization", "Bearer "+c.Token)
	}

	resp, err := c.Http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		var errRes map[string]interface{}
		_ = json.NewDecoder(resp.Body).Decode(&errRes)
		if msg, ok := errRes["error"].(string); ok {
			return fmt.Errorf("API error: %s (status: %d)", msg, resp.StatusCode)
		}
		return fmt.Errorf("API returned status: %d", resp.StatusCode)
	}

	if response != nil {
		return json.NewDecoder(resp.Body).Decode(response)
	}
	return nil
}

// Status checks the locking state of the vault.
func (c *Client) Status() (bool, string, error) {
	var res struct {
		Locked  bool   `json:"locked"`
		Version string `json:"version"`
	}
	err := c.request("GET", "/v1/vault/status", nil, &res)
	return res.Locked, res.Version, err
}

// Unlock unlocks the vault with the master password.
func (c *Client) Unlock(password string) error {
	body := map[string]string{"password": password}
	return c.request("POST", "/v1/vault/unlock", body, nil)
}

// Lock locks the vault, clearing memory.
func (c *Client) Lock() error {
	return c.request("POST", "/v1/vault/lock", nil, nil)
}
