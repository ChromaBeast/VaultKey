package crypto

import "errors"

var (
	// ErrVaultLocked is returned when an operation is attempted on a locked vault.
	ErrVaultLocked = errors.New("vault is locked")

	// ErrDecryptFailed is returned when AES-256-GCM decryption fails.
	ErrDecryptFailed = errors.New("decryption failed")

	// ErrInvalidCiphertext is returned when ciphertext is too short or invalid.
	ErrInvalidCiphertext = errors.New("invalid ciphertext")
)
