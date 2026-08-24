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
	PlanID         string `json:"plan_id"`
	TotalCount     int    `json:"total_count"`
	CustomerNotify int    `json:"customer_notify"`
}

type RazorpaySubscriptionResponse struct {
	ID     string `json:"id"`
	Entity string `json:"entity"`
	Status string `json:"status"`
}

type RazorpayAPIError struct {
	StatusCode int
	Body       string
}

func (e *RazorpayAPIError) Error() string {
	return fmt.Sprintf("razorpay api error (status %d): %s", e.StatusCode, e.Body)
}

func NewRazorpayClient(keyID, keySecret, webhookSecret string) *RazorpayClient {
	return &RazorpayClient{
		KeyID:         keyID,
		KeySecret:     keySecret,
		WebhookSecret: webhookSecret,
		HTTPClient:    &http.Client{Timeout: 10 * time.Second},
	}
}

func doRazorpayJSON(c *RazorpayClient, url string, payload any, out any) error {
	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.SetBasicAuth(c.KeyID, c.KeySecret)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("razorpay unreachable: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return &RazorpayAPIError{StatusCode: resp.StatusCode, Body: string(body)}
	}
	if err := json.Unmarshal(body, out); err != nil {
		return fmt.Errorf("razorpay response malformed: %w", err)
	}
	return nil
}

func (c *RazorpayClient) CreateOrder(amount int, currency, receipt string) (string, error) {
	var out RazorpayOrderResponse
	if err := doRazorpayJSON(c, "https://api.razorpay.com/v1/orders", RazorpayOrderRequest{
		Amount: amount, Currency: currency, Receipt: receipt,
	}, &out); err != nil {
		return "", err
	}
	if out.ID == "" {
		return "", fmt.Errorf("razorpay returned no order id")
	}
	return out.ID, nil
}

func (c *RazorpayClient) CreateSubscription(planID string, totalCount int) (string, error) {
	var out RazorpaySubscriptionResponse
	if err := doRazorpayJSON(c, "https://api.razorpay.com/v1/subscriptions", RazorpaySubscriptionRequest{
		PlanID: planID, TotalCount: totalCount, CustomerNotify: 1,
	}, &out); err != nil {
		return "", err
	}
	if out.ID == "" {
		return "", fmt.Errorf("razorpay returned no subscription id")
	}
	return out.ID, nil
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
