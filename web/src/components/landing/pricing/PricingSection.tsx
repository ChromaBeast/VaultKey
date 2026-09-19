import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingModule, type PricingPlan } from '@/components/ui/pricing-module';
import { Terminal, Cpu, Shield, Building2 } from 'lucide-react';

const VAULTKEY_PLANS: PricingPlan[] = [
  {
    id: 'community',
    name: 'Developer (OSS)',
    description: 'Self-hosted zero-telemetry single binary engine for local and VPS environments.',
    icon: <Terminal className="w-6 h-6" />,
    priceMonthly: 0,
    priceYearly: 0,
    users: 'Unlimited local seats',
    features: [
      { label: 'Unlimited secrets & local vaults', included: true },
      { label: 'RAM-only process injection', included: true },
      { label: 'Full offline CLI execution', included: true },
    ],
  },
  {
    id: 'developer',
    name: 'Developer Pro',
    description: 'Encrypted cloud backup and automated sync across dev workstations and CI pipelines.',
    icon: <Cpu className="w-6 h-6" />,
    priceMonthly: 9,
    priceYearly: 90,
    users: 'Up to 3 workstations',
    features: [
      { label: 'Encrypted cloud sync across devices', included: true },
      { label: 'Automated backup snapshots', included: true },
      { label: 'CI/CD service tokens', included: true },
    ],
  },
  {
    id: 'team',
    name: 'Team Cloud',
    description: 'Managed cloud instance for engineering teams with centralized RBAC and audit ledger.',
    icon: <Shield className="w-6 h-6" />,
    priceMonthly: 29,
    priceYearly: 290,
    users: 'Up to 25 engineers',
    features: [
      { label: 'Team RBAC (Admin / Developer / CI)', included: true },
      { label: '90-day HMAC audit ledger retention', included: true },
      { label: 'Centralized team management', included: true },
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated single-tenant infrastructure, custom SLA, and SOC2 / HIPAA readiness.',
    icon: <Building2 className="w-6 h-6" />,
    priceMonthly: 199,
    priceYearly: 1990,
    users: 'Unlimited team members',
    features: [
      { label: 'Dedicated isolated VPC deployment', included: true },
      { label: 'SAML 2.0 & Okta SSO directory sync', included: true },
      { label: '99.99% uptime guarantee SLA', included: true },
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
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <PricingModule
        title="Self-host for free. Upgrade when your team grows."
        subtitle="VaultKey is open-core. Run it yourself with zero telemetry, or let us manage uptime, team RBAC, and backups."
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
