import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { CancelSubscriptionButton } from '../components/CancelSubscriptionButton';
import { PaymentHistoryTable } from '../components/PaymentHistoryTable';
import { Toast } from '../components/Toast';
import { fetchPaymentHistory } from '../lib/api';
import type { PaymentRecord } from '../types/payment';

export const BillingPage: React.FC = () => {
  const { org } = useAuth();
  const currentPlan = org?.plan || 'free';
  const subStatus = org?.subscription_status || 'none';
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  const loadHistory = async () => {
    try {
      const data = await fetchPaymentHistory();
      setPayments(data || []);
    } catch {
      // Ignore if unauthorized or empty
    }
  };

  useEffect(() => {
    loadHistory();
  }, [org?.plan, org?.subscription_status]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1140px', margin: '0 auto', padding: '16px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
          SaaS Team Plans & Pricing
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
          Scale your enterprise zero-trust secret management with active team isolation & Razorpay AutoPay Subscriptions
        </p>
      </div>

      {org?.subscription_id && (
        <div
          className="glass-glow"
          style={{
            padding: '20px 24px',
            borderRadius: '16px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Active Subscription</h3>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: subStatus === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: subStatus === 'active' ? '#4ade80' : '#f87171',
                }}
              >
                {subStatus}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Subscription ID: <code style={{ color: '#818cf8' }}>{org.subscription_id}</code>
              {org.current_period_end && (
                <span style={{ marginLeft: '12px' }}>
                  Renews: {new Date(org.current_period_end).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          {subStatus === 'active' && <CancelSubscriptionButton onSuccess={loadHistory} onShowToast={showToast} />}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
        {/* Free Starter Plan */}
        <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Free Starter</h3>
            {currentPlan === 'free' && <span className="badge badge-read">Active</span>}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px', color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
            $0 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/ forever</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>For individual developers & micro projects</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '32px' }}>
            <li>⚡ Up to 25 secrets</li>
            <li>🔑 2 API access keys</li>
            <li>🛡️ Argon2id + AES-256-GCM encryption</li>
            <li>📜 7-day audit logs</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled={currentPlan === 'free'}>
            {currentPlan === 'free' ? 'Active Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Team Plan */}
        <div className="glass-glow" style={{ padding: '32px', borderRadius: '20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#6366f1', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '4px 14px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Most Popular
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#818cf8' }}>Pro Team</h3>
            {currentPlan === 'pro' && <span className="badge badge-admin">Active</span>}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px', color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
            ₹1,499 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>($19) / team / mo</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Auto-renewing monthly subscription via UPI AutoPay / Card</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '32px' }}>
            <li>✨ <strong>Unlimited secrets</strong></li>
            <li>⚡ <strong>Unlimited API access keys</strong></li>
            <li>🛡️ RBAC Team Role Permissions</li>
            <li>📜 90-day HMAC audit ledger history</li>
            <li>💬 Priority support</li>
          </ul>
          <RazorpayCheckoutButton
            plan="pro"
            planName="Pro Team"
            amountLabel="₹1,499"
            isCurrentPlan={currentPlan === 'pro'}
            onSuccess={loadHistory}
            onShowToast={showToast}
          />
        </div>

        {/* Enterprise Plan */}
        <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Enterprise</h3>
            {currentPlan === 'enterprise' && <span className="badge badge-admin">Active</span>}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 8px', color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>Custom</div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Dedicated infrastructure & SLA compliance</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '32px' }}>
            <li>🖥️ Dedicated isolated VPS instance</li>
            <li>🔐 SAML SSO / Okta Integration</li>
            <li>🌐 Custom domain SSL termination</li>
            <li>⏱️ 99.99% Uptime SLA Guarantee</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => showToast('Sales inquiry recorded! We will reach out within 24h.', 'success')}>
            Contact Sales
          </button>
        </div>
      </div>

      <div style={{ marginTop: '56px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
          Billing & Payment History
        </h2>
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <PaymentHistoryTable payments={payments} />
        </div>
      </div>
    </div>
  );
};
