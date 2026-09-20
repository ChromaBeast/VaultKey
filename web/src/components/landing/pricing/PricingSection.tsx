import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';
import { Terminal, Cpu, Shield, Building2 } from 'lucide-react';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'community',
    name: 'Developer (OSS)',
    description: 'Self-hosted single binary engine.',
    icon: <Terminal className="w-6 h-6" />,
    priceMonthly: 0,
    priceYearly: 0,
    users: 'Unlimited local seats',
    features: [
      { label: 'Unlimited local secrets', included: true },
      { label: 'RAM-only process injection', included: true },
      { label: '100% offline & zero telemetry', included: true },
    ],
  },
  {
    id: 'developer',
    name: 'Developer Pro',
    description: 'Encrypted cloud backup & sync.',
    icon: <Cpu className="w-6 h-6" />,
    priceMonthly: 9,
    priceYearly: 90,
    users: 'Up to 3 workstations',
    features: [
      { label: 'Encrypted sync across devices', included: true },
      { label: 'Automated backup snapshots', included: true },
      { label: 'CI/CD machine tokens', included: true },
    ],
  },
  {
    id: 'team',
    name: 'Team Cloud',
    description: 'Managed cloud for engineering teams.',
    icon: <Shield className="w-6 h-6" />,
    priceMonthly: 29,
    priceYearly: 290,
    users: 'Up to 25 engineers',
    features: [
      { label: 'Team access & roles (RBAC)', included: true },
      { label: '90-day HMAC audit ledger', included: true },
      { label: 'Centralized team management', included: true },
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated VPC & enterprise SSO.',
    icon: <Building2 className="w-6 h-6" />,
    priceMonthly: 199,
    priceYearly: 1990,
    users: 'Unlimited seats',
    features: [
      { label: 'Dedicated isolated VPC', included: true },
      { label: 'SAML 2.0 & Okta SSO', included: true },
      { label: 'Priority 99.99% SLA', included: true },
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
        margin: '72px auto 0',
        padding: '0 24px',
      }}
    >
      <PricingModule
        title="Simple, transparent pricing."
        subtitle="Free self-hosted OSS or managed cloud for teams."
        annualBillingLabel="Pay annually (save 20%)"
        buttonLabel="Get Started"
        plans={VAULTKEY_PLANS}
        defaultAnnual={false}
        className="py-0 px-0 bg-transparent"
        onSelectPlan={() => navigate('/signup')}
      />
    </section>
  );
};
