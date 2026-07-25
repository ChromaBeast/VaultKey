package db

import (
	"database/sql"
	"fmt"
	"time"
)

type Payment struct {
	ID                string    `json:"id"`
	OrgID             string    `json:"org_id"`
	RazorpayOrderID   string    `json:"razorpay_order_id"`
	RazorpayPaymentID string    `json:"razorpay_payment_id,omitempty"`
	RazorpaySignature string    `json:"razorpay_signature,omitempty"`
	Amount            int       `json:"amount"`
	Currency          string    `json:"currency"`
	Status            string    `json:"status"`
	Plan              string    `json:"plan"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func (db *DB) CreatePayment(p Payment) error {
	query := `
		INSERT INTO payments (id, org_id, razorpay_order_id, amount, currency, status, plan)
		VALUES (?, ?, ?, ?, ?, ?, ?);
	`
	_, err := db.Exec(query, p.ID, p.OrgID, p.RazorpayOrderID, p.Amount, p.Currency, p.Status, p.Plan)
	if err != nil {
		return fmt.Errorf("failed to create payment record: %w", err)
	}
	return nil
}

func (db *DB) GetPaymentByOrderID(orderID string) (*Payment, error) {
	query := `
		SELECT id, org_id, razorpay_order_id, COALESCE(razorpay_payment_id, ''), COALESCE(razorpay_signature, ''),
		       amount, currency, status, plan, created_at, updated_at
		FROM payments WHERE razorpay_order_id = ?;
	`
	row := db.QueryRow(query, orderID)

	var p Payment
	err := row.Scan(&p.ID, &p.OrgID, &p.RazorpayOrderID, &p.RazorpayPaymentID, &p.RazorpaySignature,
		&p.Amount, &p.Currency, &p.Status, &p.Plan, &p.CreatedAt, &p.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get payment by order id: %w", err)
	}
	return &p, nil
}

func (db *DB) UpdatePaymentStatus(orderID, paymentID, signature, status string) error {
	query := `
		UPDATE payments
		SET razorpay_payment_id = ?, razorpay_signature = ?, status = ?, updated_at = CURRENT_TIMESTAMP
		WHERE razorpay_order_id = ?;
	`
	_, err := db.Exec(query, paymentID, signature, status, orderID)
	if err != nil {
		return fmt.Errorf("failed to update payment status: %w", err)
	}
	return nil
}

func (db *DB) ListPaymentsByOrg(orgID string) ([]Payment, error) {
	query := `
		SELECT id, org_id, razorpay_order_id, COALESCE(razorpay_payment_id, ''), COALESCE(razorpay_signature, ''),
		       amount, currency, status, plan, created_at, updated_at
		FROM payments WHERE org_id = ? ORDER BY created_at DESC;
	`
	rows, err := db.Query(query, orgID)
	if err != nil {
		return nil, fmt.Errorf("failed to list payments: %w", err)
	}
	defer rows.Close()

	var payments []Payment
	for rows.Next() {
		var p Payment
		if err := rows.Scan(&p.ID, &p.OrgID, &p.RazorpayOrderID, &p.RazorpayPaymentID, &p.RazorpaySignature,
			&p.Amount, &p.Currency, &p.Status, &p.Plan, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		payments = append(payments, p)
	}
	return payments, nil
}
