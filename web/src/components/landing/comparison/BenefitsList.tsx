import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BENEFITS = [
  ['Memory-Derivation & AES-256-GCM', 'Secrets are encrypted at rest with AES-256-GCM using random 12-byte nonces. The master key derives in RAM upon unlock and clears when the vault locks.'],
  ['Scoped RBAC & Runtime Injection', 'Issue scoped machine tokens (admin, write, read) for services and pipelines. Secrets inject directly into process memory without touching disk.'],
  ['HMAC-Chained Audit Ledger', 'Every secret mutation and read event chains cryptographically to the previous entry with HMAC-SHA256, enabling live tamper verification.'],
];

export const BenefitsList: React.FC = () => (
  <div className="border-t border-border">
    {BENEFITS.map(([title, description]) => (
      <div key={title} className="grid gap-2 border-b border-border py-6 text-left sm:grid-cols-[minmax(240px,1fr)_2fr] sm:gap-8">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div><p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p></div>
      </div>
    ))}
    <Link to="/docs#security" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium">
      Explore encryption and the audit ledger <ArrowRight size={14} aria-hidden="true" />
    </Link>
  </div>
);
