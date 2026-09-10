import React from 'react';
import { PricingCard, type PlanProps } from './PricingCard';

const PLANS: PlanProps[] = [
  {
    id: 'free',
    name: 'Developer (Self-Hosted)',
    price: '$0',
    period: '/forever',
    desc: 'Full open-source engine. Deploy as a single binary on any VPS or local machine.',
    features: [
      'Unlimited secrets on local/self-hosted instance',
      'RAM-only execution via vaultkey CLI',
      'Argon2id + AES-256-GCM zero-knowledge encryption',
      'HMAC-SHA256 chained audit logs',
      'Embedded SQLite in WAL mode',
    ],
    ctaText: 'View Open Source Docs',
    ctaLink: '/docs',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Team Cloud',
    price: '$19',
    period: '/month',
    desc: 'Managed cloud instance for engineering teams with centralized RBAC and audit sync.',
    features: [
      'Managed cloud infrastructure & automated backups',
      'Team role-based access control (Admin / Dev / CI)',
      '90-day HMAC audit ledger retention',
      'Ephemeral 1-time self-destruct secret share links',
      'Priority GitHub & Slack support',
    ],
    ctaText: 'Start 14-Day Free Trial',
    ctaLink: '/signup',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Dedicated single-tenant infrastructure, custom SLA, and SOC2 / HIPAA readiness.',
    features: [
      'Dedicated VPC or air-gapped on-prem deployment',
      'SAML 2.0 / Okta / OIDC directory synchronization',
      'Unlimited audit log retention to custom S3/GCS bucket',
      '99.99% uptime guarantee SLA',
      'Dedicated security engineer support',
    ],
    ctaText: 'Contact Engineering',
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
      <div style={{ maxWidth: '720px', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#6366f1',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Pricing
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f5f7fa',
            lineHeight: 1.2,
            marginTop: '8px',
            marginBottom: '16px',
          }}
        >
          Self-host for free. Upgrade when your team grows.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
          VaultKey is open-core. Run it yourself with zero telemetry and full data sovereignty, or let us manage uptime, team RBAC, and backups.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
};
