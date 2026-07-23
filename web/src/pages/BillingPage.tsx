import React from 'react';
import type { Org } from '../lib/api';

export const BillingPage: React.FC<{ org: Org | null }> = ({ org }) => {
  const currentPlan = org?.plan || 'free';

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SaaS Team Plans & Pricing</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
          Scale your enterprise zero-trust secret management with active team isolation
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass" style={{ padding: '32px', borderRadius: '20px', border: currentPlan === 'free' ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Free Starter</h3>
            {currentPlan === 'free' && <span className="badge badge-read">Current Plan</span>}
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '16px 0 8px' }}>$0 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/ forever</span></div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Ideal for individual developers & micro projects</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '28px' }}>
            <li>✓ Up to 25 secrets</li>
            <li>✓ 2 API access keys</li>
            <li>✓ Argon2id + AES-256-GCM in-memory encryption</li>
            <li>✓ 7-day audit logs</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} disabled={currentPlan === 'free'}>
            {currentPlan === 'free' ? 'Active Plan' : 'Downgrade to Free'}
          </button>
        </div>

        <div className="glass" style={{ padding: '32px', borderRadius: '20px', border: currentPlan === 'pro' ? '2px solid #a855f7' : '2px solid rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.05)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
            Most Popular
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc' }}>Pro Team</h3>
            {currentPlan === 'pro' && <span className="badge badge-admin">Current Plan</span>}
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '16px 0 8px' }}>$19 <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/ team / mo</span></div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>For growing engineering teams requiring full capacity</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '28px' }}>
            <li>✓ <strong>Unlimited secrets</strong></li>
            <li>✓ <strong>Unlimited API access keys</strong></li>
            <li>✓ RBAC Team Role Permissions</li>
            <li>✓ 90-day HMAC audit ledger history</li>
            <li>✓ Priority email support</li>
          </ul>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff' }} onClick={() => alert('Stripe Billing Hook Triggered! Upgrade simulation ready.')}>
            {currentPlan === 'pro' ? 'Current Active Plan' : 'Upgrade to Pro ✨'}
          </button>
        </div>

        <div className="glass" style={{ padding: '32px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enterprise</h3>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '16px 0 8px' }}>Custom</div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Dedicated infrastructure & SLA compliance</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '28px' }}>
            <li>✓ Dedicated isolated VPS instance</li>
            <li>✓ SAML SSO / Okta Integration</li>
            <li>✓ Custom domain SSL termination</li>
            <li>✓ 99.99% Uptime SLA Guarantee</li>
          </ul>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('Sales inquiry recorded! We will contact your admin email.')}>
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};
