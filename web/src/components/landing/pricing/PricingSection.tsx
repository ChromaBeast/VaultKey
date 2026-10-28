import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';
import { useBillingEnabled } from '@/hooks/useBillingEnabled';

// Limits mirror internal/api/plan_limits.go; keep them in sync.
const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'oss',
    name: 'Free',
    description: 'For individual developers and small personal services.',
    priceMonthly: 0,
    features: [
      { label: '25 secrets encrypted at rest', included: true },
      { label: '2 team members and 2 API tokens', included: true },
      { label: 'CLI process injection (vaultkey run)', included: true },
      { label: 'HMAC-chained audit ledger', included: true },
      { label: 'Node.js, Python, and Dart SDKs', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Team',
    description: 'For engineering teams running collaborative workloads.',
    priceMonthly: 1499,
    recommended: true,
    features: [
      { label: 'Unlimited secrets, projects and API tokens', included: true },
      { label: 'Unlimited members with admin/write/read roles', included: true },
      { label: 'Secret version history with 1-click rollback', included: true },
      { label: 'Self-destructing one-time share links', included: true },
      { label: 'Everything in Free', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with custom compliance or isolation requirements.',
    priceMonthly: 0,
    features: [
      { label: 'Self-hosted Docker deployment support', included: true },
      { label: 'Architecture security review', included: true },
      { label: 'Custom audit retention and integrations on request', included: true },
      { label: 'Priority engineering support', included: true },
    ],
  },
];

export const PricingSection: React.FC<{ showHeading?: boolean }> = ({ showHeading = true }) => {
  const navigate = useNavigate();
  const billingEnabled = useBillingEnabled();
  const plans = VAULTKEY_PLANS.map((plan) => (plan.id === 'pro' ? { ...plan, comingSoon: !billingEnabled } : plan));

  return (
    <section id="pricing" className="section-shell">
      <PricingModule
        title={showHeading ? 'Start free. Grow with your team.' : ''}
        plans={plans}
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
