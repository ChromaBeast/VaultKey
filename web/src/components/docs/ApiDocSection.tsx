import React, { useState } from 'react';
import { DocsCallout } from './DocsCallout';
import { DocsCodeBlock } from './DocsCodeBlock';

interface ApiDocProps {
  onCopy?: (id: string, code: string) => void;
  copiedSnippet?: string | null;
}

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/auth/signup',
    description: 'Create an organization, generate an Argon2id salt, and initialize an admin user.',
    auth: 'Public',
    body: '{ "org_name": "Acme", "email": "admin@acme.com", "password": "..." }',
  },
  {
    method: 'POST',
    path: '/v1/auth/login',
    description: 'Authenticate user credentials, verify Turnstile token, and return JWT Bearer session.',
    auth: 'Public',
    body: '{ "email": "admin@acme.com", "password": "..." }',
  },
  {
    method: 'GET',
    path: '/v1/secrets',
    description: 'Retrieve encrypted secrets with cryptographic nonces and metadata for an environment.',
    auth: 'Bearer Token / Machine Key',
    body: 'Query: ?project=backend&env=production',
  },
  {
    method: 'POST',
    path: '/v1/secrets',
    description: 'Create or update an encrypted secret value with an incremented revision nonce.',
    auth: 'Bearer Token / Machine Key',
    body: '{ "project": "backend", "env": "production", "key": "DATABASE_URL", "value": "..." }',
  },
  {
    method: 'POST',
    path: '/v1/shares',
    description: 'Generate an ephemeral, single-read secret link with auto-expiration (e.g. 1 hour).',
    auth: 'Bearer Token',
    body: '{ "secret_text": "temporary-password", "expires_in": "3600s", "max_reads": 1 }',
  },
  {
    method: 'GET',
    path: '/v1/audit',
    description: 'Stream tamper-evident audit ledger entries with cryptographic forward hash signatures.',
    auth: 'Bearer Token (Admin)',
    body: 'Query: ?limit=50&offset=0',
  },
];

export const ApiDocSection: React.FC<ApiDocProps> = ({ onCopy, copiedSnippet }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[2]);

  const curlExample = `# Retrieve secrets via REST API
curl -X GET "https://vaultkey.sheershjaiswal.in/v1/secrets?project=backend&env=production" \\
  -H "Authorization: Bearer vk_mach_your_token_here" \\
  -H "Accept: application/json"`;

  return (
    <div className="docs-api-root">
      <div id="api-intro" className="docs-subtopic-block">
        <p className="docs-lead-text">
          VaultKey's REST API is served directly by the compiled Go backend binary.
          All endpoints enforce strict TLS, Bearer token authentication, rate limiting,
          and tamper-evident HMAC audit verification.
        </p>

        <DocsCallout type="info" title="Standard Bearer authentication">
          Include your machine key or personal access token in the standard HTTP header:{' '}
          <code className="docs-inline-code">Authorization: Bearer vk_...</code>.
        </DocsCallout>
      </div>

      <div id="api-endpoints-table" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Core endpoints</h3>

        <div className="docs-table-wrap" role="region" aria-label="REST API endpoints" tabIndex={0}>
          <table className="docs-api-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '15%' }}>Method</th>
                <th scope="col" style={{ width: '30%' }}>Endpoint</th>
                <th scope="col" style={{ width: '35%' }}>Description</th>
                <th scope="col" style={{ width: '20%' }}>Auth Scope</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((endpoint) => (
                <tr
                  key={endpoint.path + endpoint.method}
                  className={`docs-api-row ${selectedEndpoint.path === endpoint.path && selectedEndpoint.method === endpoint.method ? 'is-selected' : ''}`}
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <td>
                    <span className={`docs-method docs-method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td>
                    <code className="docs-api-endpoint">{endpoint.path}</code>
                  </td>
                  <td>{endpoint.description}</td>
                  <td className="docs-api-auth">
                    <span className="docs-api-auth-pill">{endpoint.auth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div id="api-curl" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Example cURL request</h3>
        {onCopy && (
          <DocsCodeBlock
            id="api-curl-example"
            language="Bash"
            code={curlExample}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        )}
      </div>
    </div>
  );
};
