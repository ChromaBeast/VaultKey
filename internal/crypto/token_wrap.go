package crypto

import (
	"crypto/sha256"
	"io"

	"golang.org/x/crypto/hkdf"
)

// API tokens carry 192 bits of randomness, so a fast KDF (HKDF) is enough to
// turn one into a wrapping key; Argon2id is only needed for human passwords.
// The key ID is the HKDF salt, binding each wrap to exactly one token.
const tokenWrapInfo = "vaultkey/token-wrap/v1"

func deriveTokenWrapKey(rawToken, keyID string) ([]byte, error) {
	key := make([]byte, 32)
	r := hkdf.New(sha256.New, []byte(rawToken), []byte(keyID), []byte(tokenWrapInfo))
	if _, err := io.ReadFull(r, key); err != nil {
		return nil, err
	}
	return key, nil
}

// WrapForToken seals the org master key so that only the holder of rawToken
// can recover it, letting machine tokens reopen a vault after an idle lock or
// a server restart without a human password.
func WrapForToken(orgKey []byte, rawToken, keyID string) ([]byte, error) {
	wrapKey, err := deriveTokenWrapKey(rawToken, keyID)
	if err != nil {
		return nil, err
	}
	defer Zero(wrapKey)
	return SealWithKey(wrapKey, orgKey)
}

func UnwrapForToken(wrapped []byte, rawToken, keyID string) ([]byte, error) {
	if len(wrapped) == 0 {
		return nil, ErrInvalidCiphertext
	}
	wrapKey, err := deriveTokenWrapKey(rawToken, keyID)
	if err != nil {
		return nil, err
	}
	defer Zero(wrapKey)
	return OpenWithKey(wrapKey, wrapped)
}
