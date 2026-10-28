package db

// A sealed vault was locked on purpose by an admin. Machine tokens may reopen
// a vault after an idle lock or a restart, but never a sealed one: only a
// password unlock clears the seal.

func (db *DB) SetVaultSealed(orgID string, sealed bool) error {
	v := 0
	if sealed {
		v = 1
	}
	_, err := db.Exec("UPDATE organizations SET vault_sealed = ? WHERE id = ?", v, orgID)
	return err
}

func (db *DB) IsVaultSealed(orgID string) (bool, error) {
	var sealed int
	err := db.QueryRow("SELECT vault_sealed FROM organizations WHERE id = ?", orgID).Scan(&sealed)
	return sealed == 1, err
}
