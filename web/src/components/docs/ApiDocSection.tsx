import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface ApiDocProps {
  onCopy?: (id: string, code: string) => void;
  copiedSnippet?: string | null;
  onNavigateNext?: () => void;
}

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/auth/signup',
    description: 'Create an organization and admin account',
    auth: 'Public',
  },
  {
    method: 'POST',
    path: '/v1/auth/login',
    description: 'Authenticate and derive the team key in memory',
    auth: 'Public',
  },
  {
    method: 'POST',
    path: '/v1/secrets',
    description: 'Create or update an encrypted secret',
    auth: 'Bearer token',
  },
  {
    method: 'GET',
    path: '/v1/secrets/values',
    description: 'Batch retrieve decrypted key-value pairs',
    auth: 'Bearer token',
  },
  {
    method: 'POST',
    path: '/v1/shares',
    description: 'Create a one-time secret link',
    auth: 'Bearer token',
  },
];

export const ApiDocSection: React.FC<ApiDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const curlExample = `# Retrieve decrypted key-value pairs via REST API
curl -s -X GET "https://your-vaultkey-server.com/v1/secrets/values?project=backend&env=production" \\
  -H "Authorization: Bearer vk_your_token_here" \\
  -H "Accept: application/json"`;

  return (
    <div className="docs-api-root">
      {/* 1. Summary */}
      <div id="api-overview" className="docs-subtopic-block">
        <p className="docs-lead-text">
          Core endpoints for authentication, encrypted values, and one-time sharing.
        </p>

        {/* 2. When to use this */}
        <div id="api-when" className="docs-section-card mt-6">
          <h4 className="docs-card-heading">When to use this</h4>
          <ul className="docs-bullet-list">
            <li>Building custom scripts or internal tooling that interact directly with your VaultKey server.</li>
            <li>Programmatically generating one-time share links for credentials and sensitive tokens.</li>
            <li>Integrating third-party identity or deployment systems with VaultKey's backend.</li>
          </ul>
        </div>
      </div>

      {/* 3. Authentication */}
      <div id="api-auth" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Authentication</h3>
        <p className="docs-lead-text">
          Protected endpoints require a Bearer token in the <code className="docs-inline-code">Authorization</code> header.
          You can provide an admin token or an agent machine key:
        </p>
        <div className="docs-code-window my-3">
          <pre className="text-sky-300 font-mono text-sm py-3 px-4"><code>Authorization: Bearer vk_your_token_here</code></pre>
        </div>
      </div>

      {/* 4. Endpoints Reference Table */}
      <div id="api-endpoints" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Reference: REST endpoints</h3>

        <div className="docs-table-wrap" role="region" aria-label="REST API endpoints" tabIndex={0}>
          <table className="docs-compare-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '15%' }}>Method</th>
                <th scope="col" style={{ width: '30%' }}>Endpoint</th>
                <th scope="col" style={{ width: '40%' }}>Description</th>
                <th scope="col" style={{ width: '15%' }}>Auth</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((endpoint) => (
                <tr key={endpoint.path + endpoint.method}>
                  <td>
                    <span className={`docs-method docs-method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td>
                    <code className="docs-inline-code">{endpoint.path}</code>
                  </td>
                  <td>{endpoint.description}</td>
                  <td>
                    <span className="docs-api-auth-pill">{endpoint.auth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Verify */}
      <div id="api-verify" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Verify</h3>
        <p className="docs-lead-text">
          Verify API connectivity using <code className="docs-inline-code">curl</code>:
        </p>
        {onCopy && (
          <DocsCodeBlock
            id="api-curl-example"
            language="Bash"
            code={curlExample}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        )}
        <p className="docs-text-muted mt-2 text-sm">
          Expected output: A JSON object containing the decrypted key-value pairs for the requested project and environment.
        </p>
      </div>

      {/* 6. Next */}
      <div className="docs-next-box mt-12">
        <div className="docs-next-label">Next guide</div>
        <button
          type="button"
          className="docs-next-link"
          onClick={onNavigateNext}
        >
          <span>Security model</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
