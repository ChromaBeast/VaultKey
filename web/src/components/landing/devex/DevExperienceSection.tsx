import React from 'react';
import { DevWorkflowTabs } from './DevWorkflowTabs';

export const DevExperienceSection: React.FC = () => {
  return (
    <section
      id="workflow"
      style={{
        maxWidth: '1200px',
        margin: '72px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '640px', marginBottom: '28px' }}>
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
          Workflows
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.7rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--vk-text)',
            lineHeight: 1.2,
            marginTop: '8px',
            marginBottom: '12px',
          }}
        >
          From dev to prod in one command.
        </h2>
        <p style={{ color: 'var(--vk-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
          Inject encrypted secrets into process memory without changing your code.
        </p>
      </div>

      <DevWorkflowTabs />
    </section>
  );
};
