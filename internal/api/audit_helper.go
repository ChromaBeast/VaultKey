package api

import (
	"crypto/rand"
	"encoding/hex"
	"time"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"
)

func (s *Server) LogAuditOrg(orgID, action string, secretKey, project *string, actor string, ip, ua string) error {
	prevHMAC := ""
	lastEntry, err := s.DB.GetLastAuditEntry(orgID)
	if err == nil && lastEntry != nil {
		prevHMAC = lastEntry.HMAC
	}

	idBytes := make([]byte, 16)
	if _, err := rand.Read(idBytes); err != nil {
		return err
	}
	id := hex.EncodeToString(idBytes)

	timestamp := time.Now().UTC().Format(time.RFC3339)
	signingKey := []byte(s.Config.AuditSigningKey)

	hmacSig := crypto.SignEntry(id, action, secretKey, project, actor, timestamp, prevHMAC, signingKey)
	parsedTime, _ := time.Parse(time.RFC3339, timestamp)

	entry := db.AuditEntry{
		ID:        id,
		OrgID:     orgID,
		Action:    action,
		SecretKey: secretKey,
		Project:   project,
		Actor:     actor,
		IPAddress: &ip,
		UserAgent: &ua,
		HMAC:      hmacSig,
		CreatedAt: parsedTime,
	}

	return s.DB.CreateAuditEntry(entry)
}
