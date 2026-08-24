package api

import (
	"crypto/rand"
	"encoding/hex"
	"time"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"
)

func (s *Server) LogAuditOrg(orgID, action string, secretKey, project *string, actor string, ip, ua string) error {
	m := s.auditMutexFor(orgID)
	m.Lock()
	defer m.Unlock()

	prevHMAC := ""
	lastEntry, err := s.DB.GetLastAuditEntry(orgID)
	if err != nil {
		return err
	}
	if lastEntry != nil {
		prevHMAC = lastEntry.HMAC
	}

	idBytes := make([]byte, 16)
	if _, err := rand.Read(idBytes); err != nil {
		return err
	}
	id := hex.EncodeToString(idBytes)

	signedAt := time.Now().UTC().Format(time.RFC3339)
	signingKey := []byte(s.Config.AuditSigningKey)

	hmacSig := crypto.SignEntryV2(id, action, secretKey, project, actor, signedAt, prevHMAC, signingKey)
	parsedTime, _ := time.Parse(time.RFC3339, signedAt)

	entry := db.AuditEntry{
		ID:         id,
		OrgID:      orgID,
		Action:     action,
		SecretKey:  secretKey,
		Project:    project,
		Actor:      actor,
		IPAddress:  &ip,
		UserAgent:  &ua,
		HMAC:       hmacSig,
		PrevHMAC:   &prevHMAC,
		SignedAt:   &signedAt,
		SigVersion: 2,
		CreatedAt:  parsedTime,
	}

	return s.DB.CreateAuditEntry(entry)
}
