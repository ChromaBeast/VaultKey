package crypto

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
)

func SignEntry(id, action string, secretKey, project *string, actor, timestamp, prevHMAC string, signingKey []byte) string {
	var sKey, proj string
	if secretKey != nil {
		sKey = *secretKey
	}
	if project != nil {
		proj = *project
	}
	data := id + action + sKey + proj + actor + timestamp + prevHMAC
	mac := hmac.New(sha256.New, signingKey)
	mac.Write([]byte(data))
	return hex.EncodeToString(mac.Sum(nil))
}

func SignEntryV2(id, action string, secretKey, project *string, actor, signedAt, prevHMAC string, signingKey []byte) string {
	var sKey, proj string
	if secretKey != nil {
		sKey = *secretKey
	}
	if project != nil {
		proj = *project
	}
	buf := make([]byte, 0, 256)
	buf = appendFramed(buf, id)
	buf = appendFramed(buf, action)
	buf = appendFramed(buf, sKey)
	buf = appendFramed(buf, proj)
	buf = appendFramed(buf, actor)
	buf = appendFramed(buf, signedAt)
	buf = appendFramed(buf, prevHMAC)
	mac := hmac.New(sha256.New, signingKey)
	mac.Write(buf)
	return hex.EncodeToString(mac.Sum(nil))
}

func VerifyEntryHMAC(e EntryFields, signingKey []byte) bool {
	var expected string
	switch e.SigVersion {
	case 2:
		expected = SignEntryV2(e.ID, e.Action, e.SecretKey, e.Project, e.Actor, e.SignedAt, e.PrevHMAC, signingKey)
	default:
		expected = SignEntry(e.ID, e.Action, e.SecretKey, e.Project, e.Actor, e.Timestamp, e.PrevHMAC, signingKey)
	}
	return subtle.ConstantTimeCompare([]byte(expected), []byte(e.HMAC)) == 1
}

type EntryFields struct {
	ID         string
	Action     string
	SecretKey  *string
	Project    *string
	Actor      string
	Timestamp  string
	SignedAt   string
	PrevHMAC   string
	HMAC       string
	SigVersion int
}
