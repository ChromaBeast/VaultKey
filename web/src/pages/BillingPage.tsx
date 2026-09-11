import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RazorpayCheckoutButton } from '../components/RazorpayCheckoutButton';
import { CancelSubscriptionButton } from '../components/CancelSubscriptionButton';
import { PaymentHistoryTable } from '../components/PaymentHistoryTable';
import { fetchPaymentHistory } from '../lib/payments';
import type { PaymentRecord } from '../types/payment';
import { PageHeader } from '../components/ui/PageHeader';

const ENTERPRISE_MAILTO = 'mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20inquiry';

export const BillingPage: React.FC = () => {
  const { org } = useAuth();
  const currentPlan = org?.plan || 'free';
  const subStatus = org?.subscription_status || 'none';
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      try {
        const data = await fetchPaymentHistory();
        if (!cancelled) setPayments(data || []);
      } catch {
        // Non-critical
      }
    };
    void loadHistory();
    return () => { cancelled = true; };
  }, [org?.plan, org?.subscription_status]);

  return (
    <div className="animate-fade">
      <PageHeader
        breadcrumb="BILLING & TIERS"
        title="Team Plans & Subscriptions"
        description="Zero-trust secret management with team isolation and Razorpay AutoPay recurring billing."
      />

      {org?.subscription_id && (
        <div
          className="glass"
          style={{
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            borderColor: 'rgba(60, 237, 235, 0.25)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--vk-text)' }}>Active Subscription</h3>
              <span className={subStatus === 'active' ? 'badge badge-write' : 'badge badge-danger'}>
                {subStatus}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--vk-text-muted)', marginTop: '2px' }}>
              Subscription ID: <code style={{ color: 'var(--vk-accent)' }}>{org.subscription_id}</code>
              {org.current_period_end && (
                <span style={{ marginLeft: '12px' }}>
                  Renews: {new Date(org.current_period_end).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          {subStatus === 'active' && <CancelSubscriptionButton onSuccess={() => undefined} />}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {/* Free Starter */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--vk-text)' }}>Free Starter</h3>
            {currentPlan === 'free' && <span className="badge badge-read">Active</span>}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, margin: '14px 0 4px', color: 'var(--vk-text)' }}>
            $0 <span style={{ fontSize: '0.85rem', color: 'var(--vk-text-muted)', fontWeight: 400 }}>/ forever</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--vk-text-muted)', marginBottom: '20px' }}>For individual engineers & micro projects</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem', color: 'var(--vk-text-secondary)', marginBottom: '24px', flex: 1 }}>
            <li>✓ Up to 25 encrypted secrets</li>
            <li>✓ 2 scoped machine access keys</li>
            <li>✓ Argon2id + AES-256-GCM encryption</li>
            <li>✓ 7-day HMAC audit ledger</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled>
            {currentPlan === 'free' ? 'Active Plan' : 'Free Tier'}
          </button>
        </div>

        {/* Pro Team */}
        <div className="glass-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--vk-accent)' }}>Pro Team</h3>
            {currentPlan === 'pro' && <span className="badge badge-write">Active</span>}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, margin: '14px 0 4px', color: 'var(--vk-text)' }}>
            ₹1,499 <span style={{ fontSize: '0.85rem', color: 'var(--vk-text-muted)', fontWeight: 400 }}>($19) / mo</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--vk-text-muted)', marginBottom: '20px' }}>Auto-renewing monthly subscription via UPI / Card</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem', color: 'var(--vk-text-secondary)', marginBottom: '24px', flex: 1 }}>
            <li>✓ <strong>Unlimited encrypted secrets</strong></li>
            <li>✓ <strong>Unlimited machine access keys</strong></li>
            <li>✓ RBAC Team Role Permissions</li>
            <li>✓ 90-day HMAC audit ledger history</li>
            <li>✓ Priority technical support</li>
          </ul>
          <RazorpayCheckoutButton
            plan="pro"
            planName="Pro Team"
            amountLabel="₹1,499"
            isCurrentPlan={currentPlan === 'pro'}
            onSuccess={() => undefined}
          />
        </div>

        {/* Enterprise */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--vk-text)' }}>Enterprise</h3>
            {currentPlan === 'enterprise' && <span className="badge badge-read">Active</span>}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, margin: '14px 0 4px', color: 'var(--vk-text)' }}>Custom</div>
          <p style={{ fontSize: '0.825rem', color: 'var(--vk-text-muted)', marginBottom: '20px' }}>Dedicated infrastructure & custom governance</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem', color: 'var(--vk-text-secondary)', marginBottom: '24px', flex: 1 }}>
            <li>✓ Dedicated isolated VPS instance</li>
            <li>✓ Custom domain SSL termination</li>
            <li>✓ Custom audit retention rules</li>
            <li>✓ 99.99% Uptime SLA Guarantee</li>
          </ul>
          <a href={ENTERPRISE_MAILTO} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Contact Sales
          </a>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--vk-text)', marginBottom: '14px' }}>
          Payment & Invoice History
        </h2>
        <PaymentHistoryTable payments={payments} />
      </div>
    </div>
  );
};
