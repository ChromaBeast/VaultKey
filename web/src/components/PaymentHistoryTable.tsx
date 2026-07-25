import React from 'react';
import type { PaymentRecord } from '../types/payment';

interface PaymentHistoryTableProps {
  payments: PaymentRecord[];
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.9rem' }}>
        No payment transactions recorded yet.
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    const formatted = (amount / 100).toFixed(2);
    return currency === 'INR' ? `₹${formatted}` : `$${formatted}`;
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: '24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            <th style={{ padding: '12px 16px' }}>Date</th>
            <th style={{ padding: '12px 16px' }}>Order ID</th>
            <th style={{ padding: '12px 16px' }}>Plan</th>
            <th style={{ padding: '12px 16px' }}>Amount</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#f8fafc' }}>
              <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#818cf8' }}>
                {item.razorpay_order_id}
              </td>
              <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{item.plan}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatAmount(item.amount, item.currency)}</td>
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background:
                      item.status === 'paid'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : item.status === 'failed'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(234, 179, 8, 0.2)',
                    color:
                      item.status === 'paid'
                        ? '#4ade80'
                        : item.status === 'failed'
                        ? '#f87171'
                        : '#facc15',
                  }}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
