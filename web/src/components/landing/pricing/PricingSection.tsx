import React from 'react';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'oss',
    name: 'Free',
    description: 'For your own projects.',
    priceMonthly: 0,
    features: [
      { label: '25 secrets and 2 access keys', included: true },
      { label: 'Start apps with stored secrets', included: true },
      { label: 'Use it in your app or from the command line', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Team',
    description: 'For teams working together.',
    priceMonthly: 1499,
    recommended: true,
    features: [
      { label: 'Unlimited secrets', included: true },
      { label: 'Choose who can read or change secrets', included: true },
      { label: 'Record of vault activity', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For a custom setup.',
    priceMonthly: 0,
    features: [
      { label: 'Setup for your own systems', included: true },
      { label: 'Talk through your needs', included: true },
    ],
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="section-shell">
      <PricingModule
        title="Start free. Grow with your team."
        plans={VAULTKEY_PLANS}
        onSelectPlan={(plan) => {
          if (plan.id === 'enterprise') window.location.href = 'mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20inquiry';
          else window.location.href = '/signup';
        }}
      />
    </section>
  );
};
