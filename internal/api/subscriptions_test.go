package api

import (
	"testing"
)

func TestSubscriptionSignatureVerification(t *testing.T) {
	keyID := "rzp_test_key"
	keySecret := "secret_sub_123"
	client := NewRazorpayClient(keyID, keySecret, "wh_secret")

	subID := "sub_99887766"
	paymentID := "pay_11223344"

	message := paymentID + "|" + subID
	sig := computeHMAC(message, keySecret)

	if !client.VerifySubscriptionSignature(paymentID, subID, sig) {
		t.Fatalf("expected subscription signature verification to succeed")
	}

	if client.VerifySubscriptionSignature(paymentID, subID, "bad_sig") {
		t.Fatalf("expected subscription signature verification to fail for invalid signature")
	}
}
