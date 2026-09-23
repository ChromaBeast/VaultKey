import React from 'react';
import { BenefitsList } from './BenefitsList';

export const BenefitsSection: React.FC = () => {
  return (
    <section id="comparison" className="section-shell">
      <div className="section-header">
        <h2 className="section-title">One place for your team&apos;s secrets.</h2>
        <p className="section-subtitle">Store passwords and keys together. Control who can use them, and see what changed.</p>
      </div>

      <BenefitsList />
    </section>
  );
};
