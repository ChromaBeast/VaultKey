package api

import (
	"log"
	"sync"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
)

var tokenUnlockMu sync.Mutex

// wrapOrgKeyForToken seals the currently unlocked org key with a newly minted
// token. Returns nil (token works only while unlocked) if the vault is locked.
func wrapOrgKeyForToken(orgID, rawToken, keyID string) []byte {
	orgKey, err := crypto.Global.Get(orgID)
	if err != nil {
		return nil
	}
	defer crypto.Zero(orgKey)
	wrapped, err := crypto.WrapForToken(orgKey, rawToken, keyID)
	if err != nil {
		log.Printf("failed to wrap org key for token %s: %v", keyID, err)
		return nil
	}
	return wrapped
}

// unlockWithToken reopens a locked vault from the token's own wrapped copy of
// the org key, so CI and services keep working after idle auto-lock or a
// deploy. Vaults an admin sealed explicitly stay locked.
func (s *Server) unlockWithToken(apiKey *db.APIKey, rawToken string, c *fiber.Ctx) {
	if len(apiKey.WrappedOrgKey) == 0 {
		return
	}
	tokenUnlockMu.Lock()
	defer tokenUnlockMu.Unlock()
	if !crypto.Global.IsLocked(apiKey.OrgID) {
		return
	}
	if sealed, err := s.DB.IsVaultSealed(apiKey.OrgID); err != nil || sealed {
		return
	}
	orgKey, err := crypto.UnwrapForToken(apiKey.WrappedOrgKey, rawToken, apiKey.ID)
	if err != nil {
		return
	}
	crypto.Global.Set(apiKey.OrgID, orgKey)
	crypto.Zero(orgKey)
	s.RecordActivity(apiKey.OrgID)
	_ = s.LogAuditOrg(apiKey.OrgID, "TOKEN_UNLOCK", &apiKey.ID, nil, apiKey.ID, c.IP(), c.Get("User-Agent"))
}
