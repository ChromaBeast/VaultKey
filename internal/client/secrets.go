package client

import (
	"fmt"
	"net/url"
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

func (c *Client) ListSecrets(project, env string) ([]SecretHeader, error) {
	var list []SecretHeader
	path := fmt.Sprintf("/v1/secrets?project=%s&environment=%s", url.QueryEscape(project), url.QueryEscape(env))
	err := c.request("GET", path, nil, &list)
	return list, err
}

func (c *Client) BatchGetSecrets(project, env string) (map[string]string, error) {
	var res map[string]string
	path := fmt.Sprintf("/v1/secrets/values?project=%s&environment=%s", url.QueryEscape(project), url.QueryEscape(env))
	err := c.request("GET", path, nil, &res)
	return res, err
}

func (c *Client) GetSecret(project, env, key string) (string, error) {
	var detail SecretDetail
	path := fmt.Sprintf("/v1/secrets/%s?project=%s&environment=%s", url.QueryEscape(key), url.QueryEscape(project), url.QueryEscape(env))
	err := c.request("GET", path, nil, &detail)
	if err != nil {
		return "", err
	}
	return detail.Value, nil
}

func (c *Client) CreateSecret(key, value, project, env string) error {
	return c.SetSecret(project, env, key, value)
}

func (c *Client) SetSecret(project, env, key, value string) error {
	existing, err := c.GetSecret(project, env, key)
	if err == nil && existing != "" {
		body := map[string]string{"value": value}
		path := fmt.Sprintf("/v1/secrets/%s?project=%s&environment=%s", url.QueryEscape(key), url.QueryEscape(project), url.QueryEscape(env))
		return c.request("PUT", path, body, nil)
	}

	body := map[string]string{
		"key":         key,
		"value":       value,
		"project":     project,
		"environment": env,
	}
	return c.request("POST", "/v1/secrets", body, nil)
}

func (c *Client) DeleteSecret(project, env, key string) error {
	path := fmt.Sprintf("/v1/secrets/%s?project=%s&environment=%s", url.QueryEscape(key), url.QueryEscape(project), url.QueryEscape(env))
	return c.request("DELETE", path, nil, nil)
}
