package api

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

func testHMAC(msg, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(msg))
	return hex.EncodeToString(mac.Sum(nil))
}
