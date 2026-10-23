import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface ApiDocProps {
  onCopy?: (id: string, code: string) => void;
  copiedSnippet?: string | null;
  onNavigateNext?: () => void;
}

const API_ENDPOINTS = [
  { method: 'POST', endpoint: '/v1/auth/signup', purpose: 'Create org and admin', auth: 'Public' },
  { method: 'POST', endpoint: '/v1/auth/login', purpose: 'Log in', auth: 'Public' },
  { method: 'POST', endpoint: '/v1/secrets', purpose: 'Create or update a secret', auth: 'Bearer' },
  { method: 'GET', endpoint: '/v1/secrets/values', purpose: 'Fetch decrypted values', auth: 'Bearer' },
  { method: 'POST', endpoint: '/v1/shares', purpose: 'One-time secret link', auth: 'Bearer' },
];

export const ApiDocSection: React.FC<ApiDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const curlExample = `# Fetch decrypted values
curl -s -X GET "https://your-vaultkey-server.com/v1/secrets/values?project=backend&env=production" \\
  -H "Authorization: Bearer vk_your_token_here"`;

  return (
    <section id="api" className="docs-subtopic-block scroll-mt-20">
      <h2 className="docs-h2 mb-2">REST API</h2>
      <p className="docs-lead-text mb-6">
        Interact directly with your VaultKey server over HTTP.
      </p>

      {onCopy && (
        <div className="mb-8">
          <DocsCodeBlock
            id="api-curl-code"
            language="bash"
            code={curlExample}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        </div>
      )}

      <div className="docs-table-wrap mb-6" role="region" aria-label="REST API endpoints" tabIndex={0}>
        <table className="docs-compare-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '15%' }}>Method</th>
              <th scope="col" style={{ width: '35%' }}>Endpoint</th>
              <th scope="col" style={{ width: '35%' }}>Purpose</th>
              <th scope="col" style={{ width: '15%' }}>Auth</th>
            </tr>
          </thead>
          <tbody>
            {API_ENDPOINTS.map((item) => (
              <tr key={item.endpoint + item.method}>
                <td>
                  <span className={`docs-method docs-method-${item.method.toLowerCase()}`}>
                    {item.method}
                  </span>
                </td>
                <td>
                  <code className="text-sky-300 font-mono text-xs">{item.endpoint}</code>
                </td>
                <td className="text-slate-300 text-sm">{item.purpose}</td>
                <td className="text-slate-400 text-xs font-mono">{item.auth}</td>
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
            Continue to Security →
          </button>
        </div>
      )}
    </section>
  );
};
