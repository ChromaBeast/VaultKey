package crypto

import (
	"testing"
)

func TestSignAndVerifyChain(t *testing.T) {
	key := []byte("my-hmac-signing-key")

	id1 := "audit-1"
	act1 := "UNLOCK"
	actor1 := "admin"
	ts1 := "2026-06-01T12:00:00Z"
	prev1 := ""

	hmac1 := SignEntry(id1, act1, nil, nil, actor1, ts1, prev1, key)

	id2 := "audit-2"
	act2 := "WRITE"
	s2 := "API_KEY"
	proj2 := "default"
	actor2 := "admin"
	ts2 := "2026-06-01T12:05:00Z"

	hmac2 := SignEntry(id2, act2, &s2, &proj2, actor2, ts2, hmac1, key)

	// Verify chain integrity
	expected1 := SignEntry(id1, act1, nil, nil, actor1, ts1, prev1, key)
	if hmac1 != expected1 {
		t.Fatalf("first hmac mismatch: expected %s, got %s", expected1, hmac1)
	}

	expected2 := SignEntry(id2, act2, &s2, &proj2, actor2, ts2, hmac1, key)
	if hmac2 != expected2 {
		t.Fatalf("second hmac mismatch: expected %s, got %s", expected2, hmac2)
	}

	// Tamper entry 1 by changing actor
	tamperedHmac1 := SignEntry(id1, act1, nil, nil, "attacker", ts1, prev1, key)
	
	// Verification of entry 2 with tampered entry 1 hash should mismatch
	if SignEntry(id2, act2, &s2, &proj2, actor2, ts2, tamperedHmac1, key) == hmac2 {
		t.Fatal("expected chain validation to fail after tampering previous entry")
	}
}
