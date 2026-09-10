package api

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"
)

const sentinelPlaintext = "vaultkey_sentinel"

type kvPair struct {
	id  string
	val []byte
}

func (s *Server) unlockLegacyAndMigrate(org *db.Organization, user *db.User, password string) error {
	salt, err := hex.DecodeString(org.Argon2Salt)
	if err != nil || len(salt) == 0 {
		return fmt.Errorf("corrupted salt")
	}

	crypto.Global.Derive(org.ID, password, salt)
	sentinelCipher, decErr := hex.DecodeString(org.Sentinel)
	if decErr != nil || len(sentinelCipher) == 0 {
		crypto.Global.Lock(org.ID)
		return fmt.Errorf("legacy vault has no sentinel")
	}
	sentinel, err := crypto.Decrypt(org.ID, sentinelCipher)
	if err != nil || sentinel != sentinelPlaintext {
		crypto.Global.Lock(org.ID)
		return fmt.Errorf("invalid password")
	}

	legacyKey, err := crypto.Global.Get(org.ID)
	if err != nil {
		return err
	}

	newKEK := make([]byte, 32)
	if _, err := rand.Read(newKEK); err != nil {
		return err
	}

	if err := s.reencryptVault(org.ID, legacyKey, newKEK); err != nil {
		crypto.Zero(newKEK)
		crypto.Global.Lock(org.ID)
		return fmt.Errorf("vault migration failed: %w", err)
	}

	wrap, err := crypto.WrapMasterKey(newKEK, password)
	if err != nil {
		crypto.Zero(newKEK)
		crypto.Global.Lock(org.ID)
		return err
	}

	if err := s.DB.UpsertKeyWrap(db.KeyWrap{
		OrgID:      org.ID,
		UserID:     user.ID,
		WrappedKey: wrap.Ciphertext,
		WrapSalt:   hex.EncodeToString(wrap.Salt),
		KDFParams:  wrap.Params.Encode(),
	}); err != nil {
		crypto.Zero(newKEK)
		crypto.Global.Lock(org.ID)
		return err
	}

	if err := s.DB.SetOrgKeyScheme(org.ID, "envelope"); err != nil {
		crypto.Zero(newKEK)
		crypto.Global.Lock(org.ID)
		return err
	}

	crypto.Global.Set(org.ID, newKEK)
	crypto.Zero(newKEK)
	crypto.Zero(legacyKey)
	s.RecordActivity(org.ID)
	return nil
}

func (s *Server) reencryptVault(orgID string, oldKey, newKey []byte) error {
	tx, err := s.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	loadRows := func(query string) ([]kvPair, error) {
		rows, err := tx.Query(query, orgID)
		if err != nil {
			return nil, err
		}
		defer rows.Close()
		var items []kvPair
		for rows.Next() {
			var k kvPair
			if err := rows.Scan(&k.id, &k.val); err != nil {
				return nil, err
			}
			items = append(items, k)
		}
		return items, rows.Err()
	}

	secrets, err := loadRows(`SELECT id, value FROM secrets WHERE org_id = ?`)
	if err != nil {
		return err
	}
	versions, err := loadRows(`
		SELECT sv.id, sv.value FROM secret_versions sv
		JOIN secrets s ON s.id = sv.secret_id
		WHERE s.org_id = ?`)
	if err != nil {
		return err
	}

	reencrypt := func(items []kvPair, table string) error {
		for _, item := range items {
			plain, err := crypto.OpenWithKey(oldKey, item.val)
			if err != nil {
				return fmt.Errorf("%s row %s undecryptable", table, item.id)
			}
			ct, err := crypto.SealWithKey(newKey, plain)
			crypto.Zero(plain)
			if err != nil {
				return err
			}
			if _, err := tx.Exec(`UPDATE `+table+` SET value = ? WHERE id = ?`, ct, item.id); err != nil {
				return err
			}
		}
		return nil
	}

	if err := reencrypt(secrets, "secrets"); err != nil {
		return err
	}
	if err := reencrypt(versions, "secret_versions"); err != nil {
		return err
	}

	return tx.Commit()
}
