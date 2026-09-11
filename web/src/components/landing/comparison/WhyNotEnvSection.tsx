import React from 'react';
import { ComparisonTable } from './ComparisonTable';

export const WhyNotEnvSection: React.FC = () => {
  return (
    <section
      id="comparison"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '720px', marginBottom: '36px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--vk-accent)',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Tooling Comparison
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--vk-text)',
            lineHeight: 1.2,
            marginTop: '8px',
            marginBottom: '16px',
          }}
        >
          Built for teams that outgrew .env but don't need cluster ops.
        </h2>
        <p style={{ color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-base)', lineHeight: 1.65, margin: 0 }}>
          Plain .env files leak secrets to disk and git history. Enterprise tools like HashiCorp Vault require dedicated cluster infrastructure.
          VaultKey delivers zero-knowledge encryption and RAM injection with zero operational overhead.
        </p>
      </div>

      <ComparisonTable />
    </section>
  );
};
