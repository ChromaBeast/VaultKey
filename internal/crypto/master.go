package crypto

import (
	"sync"
	"golang.org/x/crypto/argon2"
)

type MasterKey struct {
	key    []byte
	mu     sync.RWMutex
	locked bool
}

type TenantKeyManager struct {
	keys map[string]*MasterKey
	mu   sync.RWMutex
}

var Global = &TenantKeyManager{
	keys: make(map[string]*MasterKey),
}

func (t *TenantKeyManager) Derive(orgID, password string, salt []byte) {
	t.mu.Lock()
	mk, exists := t.keys[orgID]
	if !exists {
		mk = &MasterKey{locked: true}
		t.keys[orgID] = mk
	}
	t.mu.Unlock()

	mk.mu.Lock()
	defer mk.mu.Unlock()

	for i := range mk.key {
		mk.key[i] = 0
	}

	mk.key = argon2.IDKey(
		[]byte(password),
		salt,
		3,
		64*1024,
		4,
		32,
	)
	mk.locked = false
}

func (t *TenantKeyManager) Lock(orgID string) {
	t.mu.RLock()
	mk, exists := t.keys[orgID]
	t.mu.RUnlock()

	if exists && mk != nil {
		mk.mu.Lock()
		defer mk.mu.Unlock()
		for i := range mk.key {
			mk.key[i] = 0
		}
		mk.key = nil
		mk.locked = true
	}
}

func (t *TenantKeyManager) IsLocked(orgID string) bool {
	t.mu.RLock()
	mk, exists := t.keys[orgID]
	t.mu.RUnlock()

	if !exists || mk == nil {
		return true
	}

	mk.mu.RLock()
	defer mk.mu.RUnlock()
	return mk.locked
}

func (t *TenantKeyManager) Get(orgID string) ([]byte, error) {
	t.mu.RLock()
	mk, exists := t.keys[orgID]
	t.mu.RUnlock()

	if !exists || mk == nil {
		return nil, ErrVaultLocked
	}

	mk.mu.RLock()
	defer mk.mu.RUnlock()
	if mk.locked {
		return nil, ErrVaultLocked
	}
	return mk.key, nil
}
