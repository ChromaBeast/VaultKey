package db

import "database/sql"

type Tx = sql.Tx

func (db *DB) WithTx(fn func(tx *Tx) error) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := fn(tx); err != nil {
		return err
	}
	return tx.Commit()
}
