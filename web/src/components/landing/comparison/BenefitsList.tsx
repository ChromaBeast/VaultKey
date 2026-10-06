import React from 'react';
import { Link } from 'react-router-dom';

const BENEFITS = [
  ['Store safely', 'Passwords and API keys are encrypted before VaultKey saves them.'],
  ['Share carefully', 'Choose who on your team can read or change secrets.'],
  ['See what changed', 'Review a record of activity in your vault.'],
];

export const BenefitsList: React.FC = () => (
  <div className="border-t border-border">
    {BENEFITS.map(([title, description]) => (
      <div key={title} className="grid gap-2 border-b border-border py-6 text-left sm:grid-cols-[minmax(180px,1fr)_2fr] sm:gap-8">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div><p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p></div>
      </div>
    ))}
    <Link to="/docs#security" className="mt-6 inline-flex text-sm text-primary hover:underline">Explore encryption and the audit ledger →</Link>
  </div>
);
