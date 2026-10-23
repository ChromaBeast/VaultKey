import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface SdkDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

const SDK_REFS = [
  {
    lang: 'Node.js / TypeScript',
    pkg: 'vaultkey-js',
    init: 'new Vaultkey({ serverUrl, apiKey })',
    inject: 'await vk.inject(project, env)',
    get: 'await vk.get(name)',
  },
  {
    lang: 'Python',
    pkg: 'vaultkey',
    init: 'Vaultkey(server_url=..., api_key=...)',
    inject: 'vk.inject(project=..., env=...)',
    get: '—',
  },
];

export const SdkDocSection: React.FC<SdkDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const nodeCode = `import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({
  serverUrl: process.env.VAULTKEY_SERVER || 'https://your-vaultkey-server.com',
  apiKey: process.env.VAULTKEY_TOKEN || 'vk_your_token_here',
});

// Inject secrets into process.env in memory
await vk.inject('backend', 'production');

// Or fetch a single secret
// <!-- TODO: confirm which project and env get(name) reads from -->
const dbUrl = await vk.get('DATABASE_URL');`;

  const pythonCode = `from vaultkey import Vaultkey

vk = Vaultkey(
    server_url="https://your-vaultkey-server.com",
    api_key="vk_your_token_here",
)

# Inject secrets into os.environ in memory
vk.inject(project="backend", env="production")`;

  return (
    <section id="sdk" className="docs-subtopic-block scroll-mt-20">
      <h2 className="docs-h2 mb-2">SDKs</h2>
      <p className="docs-lead-text mb-6">
        Inject secrets into application memory at runtime.
      </p>

      <div className="space-y-6 mb-8">
        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            Node.js / TypeScript (<code className="text-sky-300 font-mono text-xs">vaultkey-js</code>)
          </div>
          <DocsCodeBlock
            id="sdk-node-code"
            language="typescript"
            code={nodeCode}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>

        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            Python (<code className="text-sky-300 font-mono text-xs">vaultkey</code>)
          </div>
          <DocsCodeBlock
            id="sdk-python-code"
            language="python"
            code={pythonCode}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>
      </div>

      <div className="docs-table-wrap mb-6" role="region" aria-label="SDK reference table" tabIndex={0}>
        <table className="docs-compare-table">
          <thead>
            <tr>
              <th scope="col">Language</th>
              <th scope="col">Package</th>
              <th scope="col">Initialization</th>
              <th scope="col">Inject into environment</th>
              <th scope="col">Fetch single secret</th>
            </tr>
          </thead>
          <tbody>
            {SDK_REFS.map((row) => (
              <tr key={row.lang}>
                <td className="font-medium text-white">{row.lang}</td>
                <td><code className="text-sky-300 font-mono text-xs">{row.pkg}</code></td>
                <td><code className="text-slate-300 font-mono text-xs">{row.init}</code></td>
                <td><code className="text-slate-300 font-mono text-xs">{row.inject}</code></td>
                <td><code className="text-slate-300 font-mono text-xs">{row.get}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onNavigateNext && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNavigateNext}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            Continue to MCP / AI agents →
          </button>
        </div>
      )}
    </section>
  );
};
