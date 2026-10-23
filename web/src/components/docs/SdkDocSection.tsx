import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';

interface SdkDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

export const SdkDocSection: React.FC<SdkDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const nodeCode = `import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({
  serverUrl: process.env.VAULTKEY_SERVER || 'https://your-vaultkey-server.com',
  apiKey: process.env.VAULTKEY_TOKEN || 'vk_your_token_here'
});

// Load secrets directly into process.env in memory
await vk.inject('backend', 'production');

// Retrieve a single secret (reads from the project and env specified in inject)
const dbUri = await vk.get('DATABASE_URL');
console.log('Database connected successfully');`;

  const pythonCode = `from vaultkey import Vaultkey
import os

vk = Vaultkey(
    server_url=os.getenv("VAULTKEY_SERVER", "https://your-vaultkey-server.com"),
    api_key=os.getenv("VAULTKEY_TOKEN", "vk_your_token_here")
)

# Load secrets directly into os.environ in memory
vk.inject(project="backend", env="production")

# Read an injected secret directly from os.environ
database_url = os.environ.get("DATABASE_URL")
print("Database connected successfully")`;

  return (
    <div className="docs-sdk-root">
      {/* 1. Summary */}
      <div id="sdk-overview" className="docs-subtopic-block">
        <p className="docs-lead-text">
          Read secrets from Node.js and Python services at runtime.
        </p>

        {/* 2. When to use this */}
        <div id="sdk-when" className="docs-section-card mt-6">
          <h4 className="docs-card-heading">When to use this</h4>
          <ul className="docs-bullet-list">
            <li>Loading configuration into <code className="docs-inline-code">process.env</code> or <code className="docs-inline-code">os.environ</code> on application boot.</li>
            <li>Avoiding unencrypted <code className="docs-inline-code">.env</code> files in container images or deployed filesystem mounts.</li>
            <li>Fetching dynamic secrets programmatically within background tasks or application entry points.</li>
          </ul>
        </div>
      </div>

      {/* 3. Prerequisites */}
      <div id="sdk-prereq" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Prerequisites</h3>
        <p className="docs-lead-text">
          Install the appropriate package for your language runtime and provide a token with read permissions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="docs-package-box">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Node.js / TypeScript</span>
            <code className="text-sky-400 text-sm font-mono block mt-1">npm install vaultkey-js</code>
          </div>
          <div className="docs-package-box">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Python</span>
            <code className="text-sky-400 text-sm font-mono block mt-1">pip install vaultkey</code>
          </div>
        </div>
      </div>

      {/* 4. Node.js Guide */}
      <div id="sdk-node" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Node.js / TypeScript</h3>
        <p className="docs-lead-text">
          The <code className="docs-inline-code">vaultkey-js</code> package exports the <code className="docs-inline-code">Vaultkey</code> class.
          Instantiate it with <code className="docs-inline-code">serverUrl</code> and <code className="docs-inline-code">apiKey</code>:
        </p>

        <DocsCodeBlock
          id="sdk-node-snippet"
          language="TypeScript"
          code={nodeCode}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />

        <DocsCallout type="info" title="Environment scoping for get()">
          The method <code className="docs-inline-code">vk.get(name)</code> reads the secret from the project and environment
          previously configured during <code className="docs-inline-code">vk.inject(project, env)</code>.
        </DocsCallout>
      </div>

      {/* 5. Python Guide */}
      <div id="sdk-python" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Python</h3>
        <p className="docs-lead-text">
          The <code className="docs-inline-code">vaultkey</code> package exports the <code className="docs-inline-code">Vaultkey</code> class.
          Instantiate it with <code className="docs-inline-code">server_url</code> and <code className="docs-inline-code">api_key</code>:
        </p>

        <DocsCodeBlock
          id="sdk-python-snippet"
          language="Python"
          code={pythonCode}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      {/* 6. Verify */}
      <div id="sdk-verify" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Verify</h3>
        <p className="docs-lead-text">
          Verify that <code className="docs-inline-code">inject()</code> successfully loads values by printing one of your variables:
        </p>
        <DocsCodeBlock
          id="sdk-verify-snippet"
          language="JavaScript"
          code={`console.log("DATABASE_URL exists:", Boolean(process.env.DATABASE_URL));`}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
        <p className="docs-text-muted mt-2 text-sm">
          Expected output: <code className="docs-inline-code">DATABASE_URL exists: true</code>.
        </p>
      </div>

      {/* 7. Reference */}
      <div id="sdk-ref" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Reference</h3>
        <div className="docs-table-wrap" role="region" aria-label="SDK reference table" tabIndex={0}>
          <table className="docs-compare-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '25%' }}>Runtime</th>
                <th scope="col" style={{ width: '25%' }}>Class / Constructor</th>
                <th scope="col" style={{ width: '25%' }}>Methods</th>
                <th scope="col" style={{ width: '25%' }}>Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong className="text-white">Node.js / TS</strong> (<code className="docs-inline-code">vaultkey-js</code>)</td>
                <td><code className="docs-inline-code">new Vaultkey(&#123; serverUrl, apiKey &#125;)</code></td>
                <td><code className="docs-inline-code">inject(project, env)</code><br /><code className="docs-inline-code">get(name)</code></td>
                <td>Loads into <code className="docs-inline-code">process.env</code> in memory; <code className="docs-inline-code">get()</code> returns one secret.</td>
              </tr>
              <tr>
                <td><strong className="text-white">Python</strong> (<code className="docs-inline-code">vaultkey</code>)</td>
                <td><code className="docs-inline-code">Vaultkey(server_url, api_key)</code></td>
                <td><code className="docs-inline-code">inject(project=..., env=...)</code></td>
                <td>Loads into <code className="docs-inline-code">os.environ</code> in memory.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Next */}
      <div className="docs-next-box mt-12">
        <div className="docs-next-label">Next guide</div>
        <button
          type="button"
          className="docs-next-link"
          onClick={onNavigateNext}
        >
          <span>MCP / AI agents (New)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
