import React from 'react';
import { ScatteredSecretsVisual } from './ScatteredSecretsVisual';

export const ProblemSection: React.FC = () => {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '40px' }}>
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
          THE SCATTERED REALITY
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
          The problem isn’t encryption. <br />
          The problem is that secrets end up everywhere.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          Modern engineering stacks run dozens of APIs and databases. Without a single, zero-disk source of truth, credentials leak across developer chat channels, unencrypted .env files, and staging runners. VaultKey gives them one controlled home.
        </p>
      </div>

      <ScatteredSecretsVisual />
    </section>
  );
};
