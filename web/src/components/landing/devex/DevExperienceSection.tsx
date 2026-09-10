import React from 'react';
import { DevWorkflowTabs } from './DevWorkflowTabs';

export const DevExperienceSection: React.FC = () => {
  return (
    <section
      id="developers"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '36px' }}>
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
          From .env files to production in one command.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          No cumbersome SDK refactors required. With <code>vaultkey run</code>, your existing scripts, Dockerfiles, and CI jobs receive secrets directly in process memory at boot time.
        </p>
      </div>

      <DevWorkflowTabs />
    </section>
  );
};
