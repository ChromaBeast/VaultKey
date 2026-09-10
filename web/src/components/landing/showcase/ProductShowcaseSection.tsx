import React, { useState } from 'react';
import { ShowcaseSecretsTab } from './ShowcaseSecretsTab';
import { ShowcaseAccessTab } from './ShowcaseAccessTab';
import { ShowcaseAuditTab } from './ShowcaseAuditTab';

type ShowcaseTab = 'secrets' | 'access' | 'audit';

export const ProductShowcaseSection: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ShowcaseTab>('secrets');

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '32px' }}>
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
          Real secret operations. Zero complexity.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          See how your engineering team navigates secrets, configures least-privilege tokens, and
          verifies cryptographic audit trails in a unified dashboard.
        </p>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { id: 'secrets', label: '1. Secret Management' },
          { id: 'access', label: '2. Scoped Access Control' },
          { id: 'audit', label: '3. Cryptographic Audit Trail' },
        ].map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as ShowcaseTab)}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: isActive
                  ? '1px solid rgba(94, 231, 255, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? 'rgba(94, 231, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? '#5ee7ff' : '#8b93a3',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Render Selected Showcase Tab */}
      <div>
        {currentTab === 'secrets' && <ShowcaseSecretsTab />}
        {currentTab === 'access' && <ShowcaseAccessTab />}
        {currentTab === 'audit' && <ShowcaseAuditTab />}
      </div>
    </section>
  );
};
