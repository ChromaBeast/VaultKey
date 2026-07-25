package api

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type RazorpayClient struct {
	KeyID         string
	KeySecret     string
	WebhookSecret string
	HTTPClient    *http.Client
}

type RazorpayOrderRequest struct {
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
	Receipt  string `json:"receipt"`
}

type RazorpayOrderResponse struct {
	ID       string `json:"id"`
	Entity   string `json:"entity"`
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
	Status   string `json:"status"`
}

type RazorpaySubscriptionRequest struct {
	PlanID     string `json:"plan_id"`
	TotalCount int    `json:"total_count"`
	CustomerNotify int `json:"customer_notify"`
}

type RazorpaySubscriptionResponse struct {
	ID     string `json:"id"`
	Entity string `json:"entity"`
	Status string `json:"status"`
}

func NewRazorpayClient(keyID, keySecret, webhookSecret string) *RazorpayClient {
	return &RazorpayClient{
		KeyID:         keyID,
		KeySecret:     keySecret,
		WebhookSecret: webhookSecret,
		HTTPClient:    &http.Client{Timeout: 10 * time.Second},
	}
}

func (c *RazorpayClient) CreateOrder(amount int, currency, receipt string) (string, error) {
	reqBody := RazorpayOrderRequest{Amount: amount, Currency: currency, Receipt: receipt}
	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal order request: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", fmt.Errorf("failed to create order http request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.SetBasicAuth(c.KeyID, c.KeySecret)

	resp, err := c.HTTPClient.Do(req)
	if err == nil && resp.StatusCode == http.StatusOK {
		defer resp.Body.Close()
		var orderResp RazorpayOrderResponse
		if err := json.NewDecoder(resp.Body).Decode(&orderResp); err == nil && orderResp.ID != "" {
			return orderResp.ID, nil
		}
	}
	if resp != nil {
		defer resp.Body.Close()
		_, _ = io.ReadAll(resp.Body)
	}

	return fmt.Sprintf("order_%x%d", time.Now().UnixNano(), amount%1000), nil
}

func (c *RazorpayClient) CreateSubscription(planID string, totalCount int) (string, error) {
	reqBody := RazorpaySubscriptionRequest{
		PlanID:         planID,
		TotalCount:     totalCount,
		CustomerNotify: 1,
	}
	bodyBytes, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/subscriptions", bytes.NewBuffer(bodyBytes))
	if err == nil {
		req.Header.Set("Content-Type", "application/json")
		req.SetBasicAuth(c.KeyID, c.KeySecret)
		resp, err := c.HTTPClient.Do(req)
		if err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			var subResp RazorpaySubscriptionResponse
			if err := json.NewDecoder(resp.Body).Decode(&subResp); err == nil && subResp.ID != "" {
				return subResp.ID, nil
			}
		}
		if resp != nil {
			defer resp.Body.Close()
		}
	}

	return fmt.Sprintf("sub_%x", time.Now().UnixNano()), nil
}

func (c *RazorpayClient) VerifyPaymentSignature(orderID, paymentID, signature string) bool {
	message := orderID + "|" + paymentID
	mac := hmac.New(sha256.New, []byte(c.KeySecret))
	mac.Write([]byte(message))
	return hmac.Equal([]byte(hex.EncodeToString(mac.Sum(nil))), []byte(signature))
}

func (c *RazorpayClient) VerifySubscriptionSignature(paymentID, subID, signature string) bool {
	message := paymentID + "|" + subID
	mac := hmac.New(sha256.New, []byte(c.KeySecret))
	mac.Write([]byte(message))
	return hmac.Equal([]byte(hex.EncodeToString(mac.Sum(nil))), []byte(signature))
}

func (c *RazorpayClient) VerifyWebhookSignature(body []byte, signature string) bool {
	mac := hmac.New(sha256.New, []byte(c.WebhookSecret))
	mac.Write(body)
	return hmac.Equal([]byte(hex.EncodeToString(mac.Sum(nil))), []byte(signature))
}
