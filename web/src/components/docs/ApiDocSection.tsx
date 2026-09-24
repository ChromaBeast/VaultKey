import React from 'react';

const ENDPOINTS = [
  { method: 'POST', path: '/v1/auth/signup', description: 'Create an organization and admin account', auth: 'Public' },
  { method: 'POST', path: '/v1/auth/login', description: 'Authenticate and derive the team key in memory', auth: 'Public' },
  { method: 'POST', path: '/v1/secrets', description: 'Create or update an encrypted secret', auth: 'Bearer token' },
  { method: 'GET', path: '/v1/secrets/values', description: 'Batch retrieve decrypted key-value pairs', auth: 'Bearer token' },
  { method: 'POST', path: '/v1/shares', description: 'Create a one-time secret link', auth: 'Bearer token' },
] as const;

export const ApiDocSection: React.FC = () => (
  <div className="docs-table-wrap" role="region" aria-label="REST API endpoints" tabIndex={0}>
    <table className="docs-api-table">
      <caption className="sr-only">VaultKey REST API endpoints and authentication requirements</caption>
      <thead>
        <tr>
          <th scope="col">Method</th>
          <th scope="col">Endpoint</th>
          <th scope="col">Description</th>
          <th scope="col">Auth</th>
        </tr>
      </thead>
      <tbody>
        {ENDPOINTS.map((endpoint) => (
          <tr key={endpoint.path}>
            <td><span className={`docs-method docs-method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span></td>
            <td><code className="docs-api-endpoint">{endpoint.path}</code></td>
            <td>{endpoint.description}</td>
            <td className="docs-api-auth">{endpoint.auth}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
