import React from 'react';
import { ComparisonTable } from './ComparisonTable';
import { PositioningCards } from './PositioningCards';

export const WhyNotEnvSection: React.FC = () => {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '36px' }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#f87171',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          SECURITY WITHOUT THE HEADACHE
        </div>
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
          .env files were never designed for teams.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          Traditional .env files create accidental leaks, zero auditability, and manual synchronization headaches. VaultKey bridges the gap between fragile text files and overly complex enterprise infrastructure.
        </p>
      </div>

      <ComparisonTable />
      <PositioningCards />
    </section>
  );
};
