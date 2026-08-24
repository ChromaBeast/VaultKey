package api

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"
	"vaultkey/internal/crypto"
	"vaultkey/internal/db"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const sentinelPlaintext = "vaultkey_sentinel"

type kvPair struct {
	id  string
	val []byte
}

type UnlockRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) handleUnlock(c *fiber.Ctx) error {
	var req UnlockRequest
	if err := c.BodyParser(&req); err != nil || req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "email and password are required"})
	}

	user, org, errCode, errMsg := s.authenticate(req.Email, req.Password, c)
	if errMsg != "" {
		return c.Status(errCode).JSON(fiber.Map{"error": errMsg})
	}

	if !crypto.Global.IsLocked(org.ID) {
		return c.JSON(fiber.Map{"status": "unlocked"})
	}

	if err := s.openVault(org, user, req.Password); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid email or password"})
	}

	_ = s.LogAuditOrg(org.ID, "UNLOCK", nil, nil, user.ID, c.IP(), c.Get("User-Agent"))
	return c.JSON(fiber.Map{"status": "unlocked", "org_id": org.ID})
}

func (s *Server) authenticate(email, password string, c *fiber.Ctx) (*db.User, *db.Organization, int, string) {
	user, err := s.DB.GetUserByEmail(email)
	if err != nil {
		return nil, nil, 500, "login failed"
	}
	if user == nil {
		bcrypt.CompareHashAndPassword([]byte("$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5B0X8wOQzSjKtV6sAqX0YQeUuYyZm"), []byte(password))
		return nil, nil, 401, "invalid email or password"
	}

	if user.LockedUntil != nil && user.LockedUntil.After(time.Now()) {
		remaining := time.Until(*user.LockedUntil).Round(time.Second)
		return nil, nil, 429, fmt.Sprintf("account is temporarily locked due to failed login attempts. Try again in %v", remaining)
	}

	maxAttempts := s.Config.MaxLoginAttempts
	if maxAttempts <= 0 {
		maxAttempts = 5
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		_, isLocked, _ := s.DB.RecordFailedLogin(user.ID, maxAttempts, s.Config.Lockout())
		if isLocked {
			return nil, nil, 429, fmt.Sprintf("too many failed login attempts. Account locked for %v", s.Config.Lockout())
		}
		return nil, nil, 401, "invalid email or password"
	}

	_ = s.DB.ResetFailedLogins(user.ID)

	org, err := s.DB.GetOrganizationByID(user.OrgID)
	if err != nil || org == nil {
		return nil, nil, 500, "organization not found"
	}

	return user, org, 0, ""
}

func (s *Server) openVault(org *db.Organization, user *db.User, password string) error {
	if org.KeyScheme == "envelope" {
		return s.unlockEnvelope(org, user, password)
	}
	return s.unlockLegacyAndMigrate(org, user, password)
}

func (s *Server) unlockEnvelope(org *db.Organization, user *db.User, password string) error {
	kw, err := s.DB.GetKeyWrap(org.ID, user.ID)
	if err != nil {
		return err
	}
	if kw == nil {
		return errors.New("no key wrap found for user")
	}
	params, err := crypto.ParseKDFParams(kw.KDFParams)
	if err != nil {
		return err
	}
	salt, err := hex.DecodeString(kw.WrapSalt)
	if err != nil {
		return err
	}
	kek, err := crypto.UnwrapMasterKey(&crypto.WrappedKey{Ciphertext: kw.WrappedKey, Salt: salt, Params: params}, password)
	if err != nil {
		return err
	}
	crypto.Global.Set(org.ID, kek)
	crypto.Zero(kek)
	s.RecordActivity(org.ID)
	return nil
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
