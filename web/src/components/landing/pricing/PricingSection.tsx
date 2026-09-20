import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';
import { Terminal, Shield, Building2 } from 'lucide-react';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'oss',
    name: 'Developer (OSS)',
    description: 'Self-hosted. Single binary.',
    icon: <Terminal className="w-5 h-5" />,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { label: 'Unlimited secrets & vaults', included: true },
      { label: 'Secrets injected into RAM at runtime', included: true },
      { label: 'Fully offline, zero telemetry', included: true },
      { label: 'macOS, Linux & Windows binaries', included: true },
    ],
  },
  {
    id: 'team',
    name: 'Team Cloud',
    description: 'Cloud-hosted sync for engineering teams.',
    icon: <Shield className="w-5 h-5" />,
    priceMonthly: 29,
    priceYearly: 290,
    recommended: true,
    features: [
      { label: 'Up to 25 members with role-based access', included: true },
      { label: 'Cloud sync & encrypted backups', included: true },
      { label: '90-day audit log', included: true },
      { label: 'CI/CD tokens & Docker support', included: true },
      { label: 'Team management dashboard', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated infrastructure & compliance.',
    icon: <Building2 className="w-5 h-5" />,
    priceMonthly: 199,
    priceYearly: 1990,
    features: [
      { label: 'Dedicated VPC instance', included: true },
      { label: 'SAML 2.0 & Okta SSO', included: true },
      { label: 'Custom retention & SIEM export', included: true },
      { label: '99.99% SLA & dedicated support', included: true },
    ],
  },
];

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="section-shell">
      <PricingModule
        title="Simple, transparent pricing."
        plans={VAULTKEY_PLANS}
        defaultAnnual={false}
        onSelectPlan={() => navigate('/signup')}
      />
    </section>
  );
};
