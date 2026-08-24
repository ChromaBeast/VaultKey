package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/binary"
	"encoding/json"
	"fmt"

	"golang.org/x/crypto/argon2"
)

type KDFParams struct {
	Time    int `json:"t"`
	Memory  int `json:"m"`
	Threads int `json:"p"`
}

func DefaultKDFParams() KDFParams {
	return KDFParams{Time: 3, Memory: 64 * 1024, Threads: 4}
}

type WrappedKey struct {
	Ciphertext []byte
	Salt       []byte
	Params     KDFParams
}

func deriveWrapKey(password string, salt []byte, p KDFParams) []byte {
	if p.Time <= 0 || p.Memory <= 0 || p.Threads <= 0 {
		p = DefaultKDFParams()
	}
	return argon2.IDKey([]byte(password), salt, uint32(p.Time), uint32(p.Memory), uint8(p.Threads), 32)
}

func SealWithKey(key, plaintext []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}
	return gcm.Seal(nonce, nonce, plaintext, nil), nil
}

func OpenWithKey(key, data []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return nil, ErrInvalidCiphertext
	}
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, ErrDecryptFailed
	}
	return plaintext, nil
}

func WrapMasterKey(masterKey []byte, password string) (*WrappedKey, error) {
	salt := make([]byte, 32)
	if _, err := rand.Read(salt); err != nil {
		return nil, err
	}
	params := DefaultKDFParams()
	wrapKey := deriveWrapKey(password, salt, params)
	ct, err := SealWithKey(wrapKey, masterKey)
	if err != nil {
		return nil, err
	}
	for i := range wrapKey {
		wrapKey[i] = 0
	}
	return &WrappedKey{Ciphertext: ct, Salt: salt, Params: params}, nil
}

func UnwrapMasterKey(w *WrappedKey, password string) ([]byte, error) {
	if w == nil || len(w.Salt) == 0 || len(w.Ciphertext) == 0 {
		return nil, ErrInvalidCiphertext
	}
	wrapKey := deriveWrapKey(password, w.Salt, w.Params)
	defer Zero(wrapKey)
	return OpenWithKey(wrapKey, w.Ciphertext)
}

func ParseKDFParams(raw string) (KDFParams, error) {
	var p KDFParams
	if raw == "" {
		return DefaultKDFParams(), nil
	}
	if err := json.Unmarshal([]byte(raw), &p); err != nil {
		return p, fmt.Errorf("invalid kdf params: %w", err)
	}
	return p, nil
}

func (p KDFParams) Encode() string {
	b, _ := json.Marshal(p)
	return string(b)
}

func Zero(b []byte) {
	for i := range b {
		b[i] = 0
	}
}

func appendFramed(dst []byte, s string) []byte {
	var lenBuf [4]byte
	binary.BigEndian.PutUint32(lenBuf[:], uint32(len(s)))
	dst = append(dst, lenBuf[:]...)
	return append(dst, s...)
}
