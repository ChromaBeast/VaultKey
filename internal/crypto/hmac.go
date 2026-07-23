package crypto

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

// SignEntry computes a SHA-256 HMAC for a single audit log entry, chaining it to the previous entry.
func SignEntry(id, action string, secretKey, project *string, actor, timestamp, prevHMAC string, signingKey []byte) string {
	h := hmac.New(sha256.New, signingKey)

	var sKey string
	if secretKey != nil {
		sKey = *secretKey
	}

	var proj string
	if project != nil {
		proj = *project
	}

	// Chaining structure: id + action + secretKey + project + actor + timestamp + prevHMAC
	data := id + action + sKey + proj + actor + timestamp + prevHMAC
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}
