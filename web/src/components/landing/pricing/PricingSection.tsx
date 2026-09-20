import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';
import { Terminal, Shield, Building2 } from 'lucide-react';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'oss',
    name: 'Developer (OSS)',
    description: 'Self-hosted single binary engine for local workflows.',
    icon: <Terminal className="w-5 h-5" />,
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { label: 'Unlimited local secrets & vaults', included: true },
      { label: 'RAM-only process injection (vaultkey run)', included: true },
      { label: '100% offline & zero telemetry', included: true },
      { label: 'Pre-built macOS, Linux, Windows binaries', included: true },
    ],
  },
  {
    id: 'team',
    name: 'Team Cloud',
    description: 'Managed zero-knowledge secret orchestration for teams.',
    icon: <Shield className="w-5 h-5" />,
    priceMonthly: 29,
    priceYearly: 290,
    recommended: true,
    features: [
      { label: 'Up to 25 team members with RBAC roles', included: true },
      { label: 'Automated encrypted cloud sync & backups', included: true },
      { label: '90-day HMAC immutable audit ledger', included: true },
      { label: 'CI/CD machine tokens & Docker support', included: true },
      { label: 'Centralized team management dashboard', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated VPC, enterprise SSO, and compliance SLA.',
    icon: <Building2 className="w-5 h-5" />,
    priceMonthly: 199,
    priceYearly: 1990,
    features: [
      { label: 'Dedicated isolated VPC instance', included: true },
      { label: 'SAML 2.0 & Okta SSO integration', included: true },
      { label: 'Custom audit retention & SIEM export', included: true },
      { label: 'Priority 99.99% SLA & dedicated support', included: true },
    ],
  },
];

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      style={{
        maxWidth: '1200px',
        margin: '96px auto 0',
        padding: '0 24px',
      }}
    >
      <PricingModule
        title="Simple, transparent pricing."
        subtitle="Free self-hosted OSS or managed cloud for teams."
        plans={VAULTKEY_PLANS}
        defaultAnnual={false}
        onSelectPlan={() => navigate('/signup')}
      />
    </section>
  );
};
