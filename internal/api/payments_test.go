package api

import (
	"testing"
)

func TestRazorpaySignatureVerification(t *testing.T) {
	keyID := "rzp_test_key"
	keySecret := "test_secret_12345"
	client := NewRazorpayClient(keyID, keySecret, "webhook_secret")

	orderID := "order_123456"
	paymentID := "pay_654321"

	message := orderID + "|" + paymentID
	sig := computeHMAC(message, keySecret)

	if !client.VerifyPaymentSignature(orderID, paymentID, sig) {
		t.Fatalf("expected signature verification to succeed")
	}

	if client.VerifyPaymentSignature(orderID, paymentID, "invalid_sig") {
		t.Fatalf("expected signature verification to fail for invalid signature")
	}
}

func TestRazorpayWebhookVerification(t *testing.T) {
	webhookSecret := "webhook_secret_999"
	client := NewRazorpayClient("key", "secret", webhookSecret)

	body := []byte(`{"event":"order.paid"}`)
	sig := computeHMAC(string(body), webhookSecret)

	if !client.VerifyWebhookSignature(body, sig) {
		t.Fatalf("expected webhook signature verification to succeed")
	}
}
