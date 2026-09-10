import React from 'react';
import { PricingCard, type PlanProps } from './PricingCard';

const PLANS: PlanProps[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/forever',
    desc: 'For individual developers and small side projects.',
    features: [
      '25 secrets across 3 environments',
      '2 machine API access tokens',
      '7-day audit logs',
      'CLI & Docker injection',
    ],
    ctaText: 'Start Free →',
    ctaLink: '/signup',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro Team',
    price: '$19',
    period: '/month',
    desc: 'For engineering teams requiring unified credentials & access controls.',
    features: [
      'Unlimited secrets & environments',
      'Team role-based access control (RBAC)',
      '90-day HMAC audit ledger',
      'Advanced CI/CD integrations',
      '1-Time self-destruct share links',
    ],
    ctaText: 'Start 14-day trial →',
    ctaLink: '/signup',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: "Let's talk",
    desc: 'For teams requiring dedicated infrastructure and strict compliance.',
    features: [
      'Dedicated isolated VPS deployment',
      'SAML SSO & Okta directory sync',
      'Unlimited audit retention',
      '99.99% uptime SLA',
      'Enterprise priority support',
    ],
    ctaText: 'Talk to us →',
    ctaLink: 'mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20Inquiry',
    highlighted: false,
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section
      id="pricing"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      {/* Security Trust Strip */}
      <div
        style={{
          padding: '16px 24px',
          background: 'rgba(94, 231, 255, 0.04)',
          border: '1px solid rgba(94, 231, 255, 0.15)',
          borderRadius: '12px',
          marginBottom: '56px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <span>AES-256-GCM</span>
        <span>•</span>
        <span>Argon2id</span>
        <span>•</span>
        <span>Audit logs</span>
        <span>•</span>
        <span>Self-hostable</span>
        <span>•</span>
        <span>CLI-first</span>
        <span>•</span>
        <span>Zero-knowledge</span>
      </div>

      <div style={{ maxWidth: '680px', marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f5f7fa',
            lineHeight: 1.18,
            marginBottom: '16px',
          }}
        >
          Start small. Scale securely.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          Simple, honest pricing for developers and engineering teams. No hidden user fees or infrastructure surprises.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
};
