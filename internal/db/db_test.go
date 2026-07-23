package db

import (
	"testing"
)

func TestDBOperations(t *testing.T) {
	db, err := Open("file::memory:?cache=shared")
	if err != nil {
		t.Fatalf("failed to open in-memory db: %v", err)
	}
	defer db.Close()

	orgID := "org_test"

	t.Run("OrgsAndUsers", func(t *testing.T) {
		org := Organization{
			ID:         orgID,
			Name:       "Test Org",
			Slug:       "test-org",
			Argon2Salt: "salt_123",
			Sentinel:   "sentinel_123",
			Plan:       "free",
		}
		err := db.CreateOrganization(org)
		if err != nil {
			t.Fatalf("failed to create organization: %v", err)
		}

		user := User{
			ID:           "usr_1",
			OrgID:        orgID,
			Email:        "admin@test.com",
			PasswordHash: "hashed_password",
			Role:         "owner",
		}
		err = db.CreateUser(user)
		if err != nil {
			t.Fatalf("failed to create user: %v", err)
		}

		u, err := db.GetUserByEmail("admin@test.com")
		if err != nil || u == nil {
			t.Fatalf("failed to get user: %v", err)
		}
	})

	t.Run("Secrets", func(t *testing.T) {
		sec := Secret{
			ID:          "sec_1",
			OrgID:       orgID,
			Key:         "DB_PASS",
			Value:       []byte("encrypted_value_v1"),
			Project:     "default",
			Environment: "production",
			CreatedBy:   "admin",
		}

		err := db.CreateSecret(sec)
		if err != nil {
			t.Fatalf("failed to create secret: %v", err)
		}

		retrieved, err := db.GetSecret(orgID, "default", "production", "DB_PASS")
		if err != nil || retrieved == nil {
			t.Fatalf("failed to get secret: %v", err)
		}

		updatedSec := *retrieved
		updatedSec.Value = []byte("encrypted_value_v2")
		updatedSec.Version = 2

		err = db.UpdateSecret(updatedSec, *retrieved, "ver_archive_1")
		if err != nil {
			t.Fatalf("failed to update secret: %v", err)
		}

		versions, err := db.GetSecretVersions(retrieved.ID)
		if err != nil || len(versions) != 1 {
			t.Fatalf("expected 1 archived version, got %d", len(versions))
		}
	})

	t.Run("APIKeys", func(t *testing.T) {
		proj := "api"
		key := APIKey{
			ID:          "key_1",
			OrgID:       orgID,
			Name:        "Deploy Key",
			KeyHash:     "hashed_token",
			Permissions: "read",
			Project:     &proj,
			Active:      true,
		}

		err := db.CreateAPIKey(key)
		if err != nil {
			t.Fatalf("failed to create API key: %v", err)
		}

		keys, err := db.ListAPIKeys(orgID)
		if err != nil || len(keys) != 1 {
			t.Fatalf("expected 1 key, got %d", len(keys))
		}
	})

	t.Run("Audit", func(t *testing.T) {
		entry := AuditEntry{
			ID:     "audit_1",
			OrgID:  orgID,
			Action: "UNLOCK",
			Actor:  "admin",
			HMAC:   "hmac_signature",
		}

		err := db.CreateAuditEntry(entry)
		if err != nil {
			t.Fatalf("failed to log audit: %v", err)
		}

		last, err := db.GetLastAuditEntry(orgID)
		if err != nil || last == nil || last.ID != "audit_1" {
			t.Fatal("expected last audit entry to be audit_1")
		}
	})
}
