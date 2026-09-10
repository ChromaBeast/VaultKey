import React, { useState } from 'react';

type WorkflowTab = 'cli' | 'docker' | 'ci' | 'sdk';

const CODE_SNIPPETS: Record<WorkflowTab, { title: string; lang: string; code: string; note: string }> = {
  cli: {
    title: 'Local CLI Injection',
    lang: 'bash',
    code: `# Launch process with secrets injected directly into RAM
$ vaultkey run --env=production -- npm start

[vaultkey] Authenticated as operator
[vaultkey] Derived master key via Argon2id
[vaultkey] Decrypted 14 secrets into locked memory
[vaultkey] Spawned child process (PID: 8192)`,
    note: 'Zero disk writes. Decrypted environment variables are zeroed upon process exit.',
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
    note: 'Eliminate plaintext secrets in container images or volume mounts.',
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
    note: 'Avoid synchronizing and rotating static secrets across multiple repository settings.',
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
    note: 'Designed for microservices requiring runtime credential polling and automated rotation.',
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
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['cli', 'docker', 'ci', 'sdk'] as WorkflowTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: tab === t ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                color: tab === t ? '#818cf8' : '#8b93a3',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: '#8b93a3', fontFamily: 'var(--font-mono)' }}>
          {current.title}
        </span>
      </div>

      <div style={{ padding: '20px', background: '#06070b' }}>
        <pre
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
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
          fontFamily: 'var(--font-mono)',
        }}
      >
        NOTE: {current.note}
      </div>
    </div>
  );
};
