import React, { useState } from 'react';

type WorkflowTab = 'cli' | 'docker' | 'ci' | 'sdk';

const CODE_SNIPPETS: Record<WorkflowTab, { title: string; lang: string; code: string; note: string }> = {
  cli: {
    title: 'Local CLI Injection',
    lang: 'bash',
    code: `# Run your app with secrets injected directly into process memory
$ vaultkey run --env=production -- npm start

✓ Authenticated as sheersh
✓ Vault unlocked in RAM
✓ 14 production secrets injected
✓ Application started (PID: 8192)`,
    note: 'Zero disk writes. The moment npm exit is called, injected env vars disappear from memory.',
  },
  docker: {
    title: 'Docker & Container Runtimes',
    lang: 'yaml',
    code: `version: '3.8'
services:
  api:
    image: myorg/api:latest
    environment:
      - VAULTKEY_TOKEN=\${VK_PROD_TOKEN}
      - VAULTKEY_ENV=production
    entrypoint: ["vaultkey", "run", "--", "node", "dist/index.js"]`,
    note: 'Eliminate hardcoded secrets in Dockerfiles or staging images.',
  },
  ci: {
    title: 'GitHub Actions / CI Pipelines',
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
    note: 'No need to manually sync 50 different GitHub repo secret settings.',
  },
  sdk: {
    title: 'Native Go & TypeScript SDKs',
    lang: 'typescript',
    code: `import { VaultKeyClient } from '@vaultkey/sdk';

const vk = new VaultKeyClient({
  token: process.env.VAULTKEY_TOKEN,
  endpoint: 'https://vault.internal:8080'
});

// Fetch or rotate secrets at runtime
const dbUrl = await vk.getSecret('DATABASE_URL');`,
    note: 'For high-availability microservices requiring live secret polling & rotation.',
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
        borderRadius: '16px',
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
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['cli', 'docker', 'ci', 'sdk'] as WorkflowTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? 'rgba(94, 231, 255, 0.12)' : 'transparent',
                border: tab === t ? '1px solid rgba(94, 231, 255, 0.3)' : '1px solid transparent',
                color: tab === t ? '#5ee7ff' : '#8b93a3',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: '#8b93a3', fontFamily: 'JetBrains Mono, monospace' }}>
          {current.title}
        </span>
      </div>

      <div style={{ padding: '20px', background: '#06070b' }}>
        <pre
          style={{
            margin: 0,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: '#f5f7fa',
            overflowX: 'auto',
          }}
        >
          {current.code}
        </pre>
      </div>

      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.25)',
          fontSize: '0.78rem',
          color: '#8b93a3',
        }}
      >
        ⚡ {current.note}
      </div>
    </div>
  );
};
