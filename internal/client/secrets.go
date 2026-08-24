package client

import (
	"encoding/json"
	"fmt"
	"net/url"
	"time"
)

type SecretHeader struct {
	ID        string `json:"id"`
	Key       string `json:"key"`
	Project   string `json:"project"`
	Env       string `json:"env"`
	Version   int    `json:"version"`
	CreatedBy string `json:"created_by"`
}

type SecretDetail struct {
	Key     string `json:"key"`
	Value   string `json:"value"`
	Version int    `json:"version"`
}

type SecretVersion struct {
	Version   int       `json:"version"`
	Value     string    `json:"value"`
	CreatedAt time.Time `json:"created_at"`
}

func secretPath(project, env, key string) string {
	return fmt.Sprintf("/v1/secrets/%s?project=%s&environment=%s", url.QueryEscape(key), url.QueryEscape(project), url.QueryEscape(env))
}

func (c *Client) ListSecrets(project, env string) ([]SecretHeader, error) {
	var list []SecretHeader
	path := fmt.Sprintf("/v1/secrets?project=%s&environment=%s", url.QueryEscape(project), url.QueryEscape(env))
	err := c.request("GET", path, nil, &list)
	return list, err
}

func (c *Client) GetSecret(project, env, key string) (string, error) {
	var detail SecretDetail
	if err := c.request("GET", secretPath(project, env, key), nil, &detail); err != nil {
		return "", err
	}
	return detail.Value, nil
}

func (c *Client) BatchGetSecrets(project, env string) (map[string]string, error) {
	path := fmt.Sprintf("/v1/secrets/values?project=%s&environment=%s", url.QueryEscape(project), url.QueryEscape(env))
	var raw json.RawMessage
	if err := c.request("GET", path, nil, &raw); err != nil {
		return nil, err
	}
	var m map[string]string
	if err := json.Unmarshal(raw, &m); err == nil {
		return m, nil
	}
	var arr []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	}
	if err := json.Unmarshal(raw, &arr); err == nil {
		m := make(map[string]string, len(arr))
		for _, item := range arr {
			m[item.Key] = item.Value
		}
		return m, nil
	}
	return nil, fmt.Errorf("unexpected response shape from batch endpoint")
}

func (c *Client) ListSecretVersions(project, env, key string) ([]SecretVersion, error) {
	var list []SecretVersion
	err := c.request("GET", secretPath(project, env, key)+"/versions", nil, &list)
	return list, err
}

func (c *Client) RollbackSecret(project, env, key string, version int) (int, error) {
	path := fmt.Sprintf("/v1/secrets/%s/rollback?project=%s&environment=%s&version=%d",
		url.QueryEscape(key), url.QueryEscape(project), url.QueryEscape(env), version)
	var res struct {
		Version int `json:"version"`
	}
	err := c.request("POST", path, nil, &res)
	return res.Version, err
}

func (c *Client) SetSecret(project, env, key, value string) error {
	err := c.request("PUT", secretPath(project, env, key), map[string]string{"value": value}, nil)
	if err == nil {
		return nil
	}
	if IsNotFound(err) {
		body := map[string]string{
			"key":         key,
			"value":       value,
			"project":     project,
			"environment": env,
		}
		return c.request("POST", "/v1/secrets", body, nil)
	}
	return err
}

func (c *Client) CreateSecret(key, value, project, env string) error {
	return c.SetSecret(project, env, key, value)
}

func (c *Client) DeleteSecret(project, env, key string) error {
	return c.request("DELETE", secretPath(project, env, key), nil, nil)
}
