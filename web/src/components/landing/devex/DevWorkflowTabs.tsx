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

const dbUrl = await VaultKey.get('DATABASE_URL');`,
  },
};

export const DevWorkflowTabs: React.FC = () => {
  const [tab, setTab] = useState<WorkflowTab>('cli');

  const current = CODE_SNIPPETS[tab];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg shadow-black/40">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border bg-secondary/80 flex-wrap gap-2">
        <div role="tablist" aria-label="Workflow implementation environments" className="flex gap-2">
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
                className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold uppercase transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="p-5 sm:p-6 bg-background/80 overflow-x-auto"
      >
        <pre className="m-0 font-mono text-xs sm:text-sm leading-relaxed text-foreground">
          {current.code}
        </pre>
      </div>
    </div>
  );
};
