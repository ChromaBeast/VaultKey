import React from 'react';
import { EnvironmentMatrixCards } from './EnvironmentMatrixCards';

export const ProductOverviewSection: React.FC = () => {
  return (
    <section
      id="product"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f5f7fa',
            lineHeight: 1.18,
            marginBottom: '16px',
          }}
        >
          One vault. Every environment.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          VaultKey isn’t just encrypted storage. It controls how engineers and machines access
          credentials — ensuring development keys never leak into production, and production
          credentials remain completely inaccessible to local workstations.
        </p>
      </div>

      <EnvironmentMatrixCards />
    </section>
  );
};
