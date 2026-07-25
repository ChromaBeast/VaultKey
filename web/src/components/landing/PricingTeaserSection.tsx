import React from 'react';
import { Link } from 'react-router-dom';

const FREE_FEATURES = [
  '25 secrets across all projects',
  '2 API access tokens',
  'Argon2id RAM key derivation',
  'AES-256-GCM per-secret encryption',
  'HMAC audit ledger (30 days)',
];

const PRO_FEATURES = [
  'Unlimited secrets & projects',
  'Unlimited API tokens',
  'Full HMAC audit ledger (90 days)',
  'Secret version history & rollback',
  '1-Time self-destruct share links',
  'UPI AutoPay / eNACH mandate',
];

const ENT_FEATURES = [
  'Isolated VPS deployment',
  'SAML SSO / Okta integration',
  'Unlimited audit retention',
  '99.99% uptime SLA',
  'Priority incident support',
];

interface FeatureListProps { items: string[]; }
const FeatureList: React.FC<FeatureListProps> = ({ items }) => (
  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
    {items.map((item) => (
      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#cbd5e1' }}>
        <span style={{ color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', marginTop: '1px', flexShrink: 0 }}>✓</span>
        {item}
      </li>
    ))}
  </ul>
);

export const PricingTeaserSection: React.FC = () => {
  return (
    <section style={{ maxWidth: '1200px', margin: '100px auto 80px', padding: '0 24px' }}>
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc', marginBottom: '10px' }}>
          Transparent pricing
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Free to start. India-first billing via Razorpay AutoPay — no USD friction.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Free */}
        <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
              FREE
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>₹0</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/forever</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '6px' }}>
              Individual devs &amp; side projects
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <FeatureList items={FREE_FEATURES} />
            <div style={{ marginTop: 'auto' }}>
              <Link to="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Pro — highlighted */}
        <div
          className="glass-glow"
          style={{ padding: '32px', borderRadius: '16px', position: 'relative', display: 'flex', flexDirection: 'column' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#6366f1',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              padding: '3px 14px',
              borderRadius: '0 0 8px 8px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            MOST POPULAR
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
              PRO TEAM
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>₹1,499</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/mo</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '6px' }}>
              Growing engineering teams
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <FeatureList items={PRO_FEATURES} />
            <div style={{ marginTop: 'auto' }}>
              <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Start 14-Day Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Enterprise */}
        <div className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
              ENTERPRISE
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em' }}>Custom</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '6px' }}>
              Dedicated VPS &amp; compliance SLA
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <FeatureList items={ENT_FEATURES} />
            <div style={{ marginTop: 'auto' }}>
              <Link to="/docs" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
