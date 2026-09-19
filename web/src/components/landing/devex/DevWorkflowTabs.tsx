import React, { useState } from 'react';

type WorkflowTab = 'cli' | 'docker' | 'ci' | 'sdk';

const CODE_SNIPPETS: Record<WorkflowTab, { title: string; lang: string; code: string }> = {
  cli: {
    title: 'Local CLI Injection',
    lang: 'bash',
    code: `# Launch process with secrets injected directly into RAM
$ vaultkey run --env=production -- npm start

[vaultkey] Authenticated as operator
[vaultkey] Derived master key via Argon2id
[vaultkey] Decrypted 14 secrets into locked memory
[vaultkey] Spawned child process (PID: 8192)`,
  },
  docker: {
    title: 'Docker Runtimes',
    lang: 'yaml',
    code: `version: '3.8'
services:
  api:
    image: myorg/api:latest
    environment:
      - VAULTKEY_TOKEN=\${VK_PROD_TOKEN}
      - VAULTKEY_ENV=production
    entrypoint: ["vaultkey", "run", "--", "node", "dist/index.js"]`,
  },
  ci: {
    title: 'CI / CD Workflows',
    lang: 'yaml',
    code: `name: Deploy Production
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Inject VaultKey Secrets
        uses: vaultkey/action@v1
        with:
          token: \${{ secrets.VK_CI_TOKEN }}
          env: production
      - run: npm run build`,
  },
  sdk: {
    title: 'Programmatic API',
    lang: 'typescript',
    code: `import { VaultKeyClient } from '@vaultkey/sdk';

const vk = new VaultKeyClient({
  token: process.env.VAULTKEY_TOKEN,
  endpoint: 'https://vault.internal:8080'
});

// Decrypt and fetch dynamic database credentials at runtime
const dbUrl = await vk.getSecret('DATABASE_URL');`,
  },
};

export const DevWorkflowTabs: React.FC = () => {
  const [tab, setTab] = useState<WorkflowTab>('cli');

  const current = CODE_SNIPPETS[tab];

  return (
    <div
      style={{
        background: '#090c14',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'rgba(255, 255, 255, 0.02)',
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
        style={{ padding: '20px', background: '#06070b' }}
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
