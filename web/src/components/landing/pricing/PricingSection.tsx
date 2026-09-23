import React from 'react';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';
import { Terminal, Shield, Building2 } from 'lucide-react';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'oss',
    name: 'Free Starter',
    description: 'For individual developers.',
    icon: <Terminal className="w-5 h-5" />,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { label: '25 secrets and 2 access keys', included: true },
      { label: 'Run secrets from memory', included: true },
      { label: 'CLI and SDK access', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro Team',
    description: 'For teams sharing secrets.',
    icon: <Shield className="w-5 h-5" />,
    priceMonthly: 19,
    priceYearly: 19,
    recommended: true,
    features: [
      { label: 'Unlimited secrets', included: true },
      { label: 'Team roles and access keys', included: true },
      { label: 'Encrypted cloud sync', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Need a custom setup?',
    icon: <Building2 className="w-5 h-5" />,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { label: 'Custom infrastructure', included: true },
      { label: 'Talk to our team', included: true },
    ],
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="section-shell">
      <PricingModule
        title="Straightforward plans."
        plans={VAULTKEY_PLANS}
        onSelectPlan={(plan) => {
          if (plan.id === 'enterprise') window.location.href = 'mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20inquiry';
          else window.location.href = '/signup';
        }}
      />
    </section>
  );
};
