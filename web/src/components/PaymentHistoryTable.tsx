import React from 'react';
import type { PaymentRecord } from '../types/payment';

interface PaymentHistoryTableProps {
  payments: PaymentRecord[];
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--vk-text-muted)', fontSize: '0.85rem' }}>
        No payment transactions recorded yet.
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    const formatted = (amount / 100).toFixed(2);
    return currency === 'INR' ? `₹${formatted}` : `$${formatted}`;
  };

  return (
    <div className="table-wrap glass">
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>ORDER ID</th>
            <th>PLAN</th>
            <th>AMOUNT</th>
            <th style={{ textAlign: 'right' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => {
            const isPaid = item.status === 'paid';
            const isFailed = item.status === 'failed';
            return (
              <tr key={item.id}>
                <td style={{ color: 'var(--vk-text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="code-font" style={{ fontSize: '0.8rem', color: 'var(--vk-accent)' }}>
                  {item.razorpay_order_id}
                </td>
                <td style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 500, color: 'var(--vk-text)' }}>
                  {item.plan}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--vk-text)', fontSize: '0.875rem' }}>
                  {formatAmount(item.amount, item.currency)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={isPaid ? 'badge badge-write' : isFailed ? 'badge badge-danger' : 'badge badge-admin'}>
                    {item.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
