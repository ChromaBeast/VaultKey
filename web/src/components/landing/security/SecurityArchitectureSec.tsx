import React from 'react';
import { SecurityFlowDiagram } from './SecurityFlowDiagram';
import { SecuritySpecDetails } from './SecuritySpecDetails';

export const SecurityArchitectureSec: React.FC = () => {
  return (
    <section
      id="security"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '32px' }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#818cf8',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          CRYPTOGRAPHIC DESIGN
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
          Security you can actually understand.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          Your plaintext secrets stay out of the database. We built VaultKey around a zero-disk
          architecture where master secrets are derived fresh in RAM on unlock and zeroed the
          moment the vault locks. No plaintext at rest. No exceptions.
        </p>
      </div>

      <SecurityFlowDiagram />
      <SecuritySpecDetails />
    </section>
  );
};
