import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'oss',
    name: 'Free',
    description: 'For individual developers and small personal services.',
    priceMonthly: 0,
    features: [
      { label: '25 secrets encrypted at rest', included: true },
      { label: '2 active scoped API tokens', included: true },
      { label: 'CLI process injection (vaultkey run)', included: true },
      { label: 'Node.js, Python, and Dart SDKs', included: true },
      { label: 'Argon2id 64MB key derivation', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Team',
    description: 'For engineering teams running collaborative workloads.',
    priceMonthly: 1499,
    recommended: true,
    features: [
      { label: 'Unlimited encrypted secrets & projects', included: true },
      { label: 'Multi-user envelope key wrapping (admin/write/read)', included: true },
      { label: 'HMAC-SHA256 chained audit ledger with CSV export', included: true },
      { label: 'Secret version history with 1-click rollback', included: true },
      { label: 'Self-destructing one-time share links', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with custom compliance or isolation requirements.',
    priceMonthly: 0,
    features: [
      { label: 'Self-hosted Docker / air-gapped deployment', included: true },
      { label: 'Custom audit retention & SIEM webhook dispatching', included: true },
      { label: 'Architecture security review & SLA guarantees', included: true },
      { label: 'Priority engineering support', included: true },
    ],
  },
];

export const PricingSection: React.FC<{ showHeading?: boolean }> = ({ showHeading = true }) => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="section-shell">
      <PricingModule
        title={showHeading ? 'Start free. Grow with your team.' : ''}
        plans={VAULTKEY_PLANS}
        onSelectPlan={(plan) => {
          if (plan.id === 'enterprise') {
            window.location.href = 'mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20inquiry';
          } else {
            navigate('/signup');
          }
        }}
      />
    </section>
  );
};
