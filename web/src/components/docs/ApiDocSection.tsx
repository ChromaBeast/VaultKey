import React from 'react';

export const ApiDocSection: React.FC = () => {
  return (
    <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>REST API Endpoints</h3>
      <table>
        <thead>
          <tr><th>METHOD</th><th>ENDPOINT</th><th>DESCRIPTION</th><th>AUTH REQUIRED</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span className="badge badge-read">POST</span></td>
            <td className="code-font">/v1/auth/signup</td>
            <td>Create a new organization & admin user account</td>
            <td>Public</td>
          </tr>
          <tr>
            <td><span className="badge badge-read">POST</span></td>
            <td className="code-font">/v1/auth/login</td>
            <td>Authenticate user & derive team Argon2id key in RAM</td>
            <td>Public</td>
          </tr>
          <tr>
            <td><span className="badge badge-write">POST</span></td>
            <td className="code-font">/v1/secrets</td>
            <td>Create or update an AES-256-GCM encrypted secret</td>
            <td>Bearer Token</td>
          </tr>
          <tr>
            <td><span className="badge badge-admin">GET</span></td>
            <td className="code-font">/v1/secrets/values</td>
            <td>Batch retrieve all decrypted secret key-value pairs</td>
            <td>Bearer Token</td>
          </tr>
          <tr>
            <td><span className="badge badge-admin">POST</span></td>
            <td className="code-font">/v1/shares</td>
            <td>Create a 1-time self-destructing secret link</td>
            <td>Bearer Token</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
