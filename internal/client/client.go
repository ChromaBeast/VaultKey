package client

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"
)

const defaultTimeout = 30 * time.Second

var retryDelays = []time.Duration{250 * time.Millisecond, 750 * time.Millisecond}

// Client handles communication with the VaultKey REST API.
type Client struct {
	BaseURL string
	Token   string
	Http    *http.Client
}

// APIError carries the HTTP status so callers can react to specific codes.
type APIError struct {
	Status  int
	Message string
}

func (e *APIError) Error() string {
	if e.Message != "" {
		return fmt.Sprintf("API error: %s (status: %d)", e.Message, e.Status)
	}
	return fmt.Sprintf("API returned status: %d", e.Status)
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
		Http:    &http.Client{Timeout: timeoutFromEnv()},
	}
}

func timeoutFromEnv() time.Duration {
	if v := os.Getenv("VAULTKEY_TIMEOUT"); v != "" {
		if d, err := time.ParseDuration(v); err == nil && d > 0 {
			return d
		}
	}
	return defaultTimeout
}

func (c *Client) request(method, path string, body interface{}, response interface{}) error {
	var err error
	for attempt := 0; attempt <= len(retryDelays); attempt++ {
		if attempt > 0 {
			time.Sleep(retryDelays[attempt-1])
		}
		var retryable bool
		retryable, err = c.attempt(method, path, body, response)
		if err == nil || !retryable {
			break
		}
	}
	return err
}

func (c *Client) attempt(method, path string, body interface{}, response interface{}) (bool, error) {
	var bodyBuf *bytes.Buffer
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return false, err
		}
		bodyBuf = bytes.NewBuffer(data)
	} else {
		bodyBuf = bytes.NewBuffer(nil)
	}

	req, err := http.NewRequest(method, c.BaseURL+path, bodyBuf)
	if err != nil {
		return false, err
	}

	req.Header.Set("Content-Type", "application/json")
	if c.Token != "" {
		req.Header.Set("Authorization", "Bearer "+c.Token)
	}

	resp, err := c.Http.Do(req)
	if err != nil {
		return true, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		apiErr := &APIError{Status: resp.StatusCode}
		var errRes map[string]interface{}
		if json.NewDecoder(resp.Body).Decode(&errRes) == nil {
			if msg, ok := errRes["error"].(string); ok {
				apiErr.Message = msg
			}
		}
		return resp.StatusCode >= 500, apiErr
	}

	if response != nil {
		if err := json.NewDecoder(resp.Body).Decode(response); err != nil {
			return false, err
		}
	}
	return false, nil
}

// IsNotFound reports whether err is a 404 API error.
func IsNotFound(err error) bool {
	var apiErr *APIError
	return errors.As(err, &apiErr) && apiErr.Status == http.StatusNotFound
}
