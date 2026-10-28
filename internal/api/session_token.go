package api

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"vaultkey/internal/db"
)

func (s *Server) createSessionToken(orgID, name, permissions string) (string, error) {
	keyBytes := make([]byte, 16)
	secBytes := make([]byte, 24)
	if _, err := rand.Read(keyBytes); err != nil {
		return "", fmt.Errorf("failed to generate key bytes: %w", err)
	}
	if _, err := rand.Read(secBytes); err != nil {
		return "", fmt.Errorf("failed to generate secret bytes: %w", err)
	}

	id := "vk_" + hex.EncodeToString(keyBytes[:6])
	secret := hex.EncodeToString(secBytes)
	rawToken := id + "." + secret

	h := sha256.Sum256([]byte(rawToken))
	hashed := hex.EncodeToString(h[:])

	expiresAt := nowPlus24h()
	apiKey := db.APIKey{
		ID:            id,
		OrgID:         orgID,
		Name:          name,
		KeyHash:       hashed,
		Permissions:   permissions,
		ExpiresAt:     &expiresAt,
		Active:        true,
		WrappedOrgKey: wrapOrgKeyForToken(orgID, rawToken, id),
	}
	if err := s.DB.CreateAPIKey(apiKey); err != nil {
		return "", err
	}
	return rawToken, nil
}
