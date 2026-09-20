import React, { useState } from 'react';

type WorkflowTab = 'cli' | 'docker' | 'ci' | 'sdk';

const CODE_SNIPPETS: Record<WorkflowTab, { title: string; lang: string; code: string }> = {
  cli: {
    title: 'Local CLI',
    lang: 'bash',
    code: `$ vaultkey run -- npm start

✓ 14 secrets injected into memory
✓ Process started (PID 8192)
✓ Server listening on http://localhost:3000`,
  },
  docker: {
    title: 'Docker',
    lang: 'yaml',
    code: `services:
  app:
    image: node:20-alpine
    environment:
      - VAULTKEY_TOKEN=\${VK_TOKEN}
    entrypoint: ["vaultkey", "run", "--", "npm", "start"]`,
  },
  ci: {
    title: 'GitHub Actions',
    lang: 'yaml',
    code: `- name: Inject Secrets & Run Tests
  uses: vaultkey/action@v1
  with:
    token: \${{ secrets.VK_TOKEN }}
    run: npm test`,
  },
  sdk: {
    title: 'TypeScript SDK',
    lang: 'typescript',
    code: `import { VaultKey } from '@vaultkey/sdk';

// Fetch decrypted secret directly in memory
const dbUrl = await VaultKey.get('DATABASE_URL');`,
  },
};

export const DevWorkflowTabs: React.FC = () => {
  const [tab, setTab] = useState<WorkflowTab>('cli');

  const current = CODE_SNIPPETS[tab];

  return (
    <div
      style={{
        background: 'var(--vk-surface-1)',
        border: '1px solid var(--vk-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--vk-shadow-md)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid var(--vk-border)',
          background: 'var(--vk-surface-2)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div role="tablist" aria-label="Workflow implementation environments" style={{ display: 'flex', gap: '6px' }}>
          {(['cli', 'docker', 'ci', 'sdk'] as WorkflowTab[]).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                role="tab"
                id={`tab-${t}`}
                aria-selected={isActive}
                aria-controls={`panel-${t}`}
                onClick={() => setTab(t)}
                style={{
                  background: isActive ? 'var(--vk-accent)' : 'transparent',
                  border: isActive ? '1px solid var(--vk-accent)' : '1px solid transparent',
                  color: isActive ? '#ffffff' : 'var(--vk-text-muted)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: isActive ? 600 : 500,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  transition: 'all 0.15s ease',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--vk-text-muted)', fontFamily: 'var(--font-mono)' }}>
          {current.title}
        </span>
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        style={{ padding: '20px', background: 'var(--vk-bg)' }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 1.6,
            color: 'var(--vk-text)',
            overflowX: 'auto',
          }}
        >
          {current.code}
        </pre>
      </div>
    </div>
  );
};
