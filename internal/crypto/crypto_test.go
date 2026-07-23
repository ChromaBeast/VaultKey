package crypto

import (
	"testing"
)

func TestMasterKey_DeriveAndLock(t *testing.T) {
	orgID := "org_test1"
	password := "my-secure-password"
	salt := make([]byte, 32)
	for i := range salt {
		salt[i] = byte(i)
	}

	if !Global.IsLocked(orgID) {
		t.Fatal("expected vault to be locked initially")
	}

	_, err := Global.Get(orgID)
	if err != ErrVaultLocked {
		t.Fatalf("expected ErrVaultLocked, got %v", err)
	}

	Global.Derive(orgID, password, salt)

	if Global.IsLocked(orgID) {
		t.Fatal("expected vault to be unlocked after derivation")
	}

	key, err := Global.Get(orgID)
	if err != nil {
		t.Fatalf("unexpected error getting key: %v", err)
	}

	if len(key) != 32 {
		t.Fatalf("expected key length of 32, got %d", len(key))
	}

	Global.Lock(orgID)

	if !Global.IsLocked(orgID) {
		t.Fatal("expected vault to be locked after Lock()")
	}

	_, err = Global.Get(orgID)
	if err != ErrVaultLocked {
		t.Fatalf("expected ErrVaultLocked after Lock(), got %v", err)
	}
}

func TestEncryptDecrypt(t *testing.T) {
	orgID := "org_test2"
	password := "another-password"
	salt := make([]byte, 32)
	for i := range salt {
		salt[i] = byte(i + 1)
	}

	Global.Derive(orgID, password, salt)

	plaintext := "my-ultra-secret-value-1234"

	ciphertext, err := Encrypt(orgID, plaintext)
	if err != nil {
		t.Fatalf("failed to encrypt: %v", err)
	}

	if len(ciphertext) <= 12 {
		t.Fatal("ciphertext is too short")
	}

	decrypted, err := Decrypt(orgID, ciphertext)
	if err != nil {
		t.Fatalf("failed to decrypt: %v", err)
	}

	if decrypted != plaintext {
		t.Fatalf("expected plaintext %q, got %q", plaintext, decrypted)
	}

	Global.Lock(orgID)
	_, err = Decrypt(orgID, ciphertext)
	if err != ErrVaultLocked {
		t.Fatalf("expected ErrVaultLocked when locked, got %v", err)
	}
}
