import React from 'react';
import { ComparisonTable } from './ComparisonTable';

export const WhyNotEnvSection: React.FC = () => {
  return (
    <section id="comparison" className="section-shell">
      <div className="section-header">
        <span className="section-eyebrow">
          Comparison
        </span>
        <h2 className="section-title">
          Ditch `.env` files.
        </h2>
      </div>

      <ComparisonTable />
    </section>
  );
};
