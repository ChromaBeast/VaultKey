import React, { useState } from 'react';

interface SecretItem {
  key: string;
  version: string;
  env: string;
  val: string;
  updated: string;
}

const SECRETS_DATA: SecretItem[] = [
  { key: 'STRIPE_WEBHOOK_SECRET', version: 'v3', env: 'production', val: 'whsec_9829f018da39b41a0e', updated: '2 hours ago by sheersh' },
  { key: 'DATABASE_REPLICA_URL', version: 'v1', env: 'production', val: 'postgres://readonly:p901x@cluster-db:5432', updated: 'Yesterday by alice' },
  { key: 'RESEND_API_KEY', version: 'v2', env: 'production', val: 're_4019a8bc43f019', updated: '3 days ago by ci-sync' },
  { key: 'REDIS_CACHE_AUTH', version: 'v4', env: 'production', val: 'rediss://default:8fa901bc@cache:6379', updated: '1 week ago by sheersh' },
];

export const ShowcaseSecretsTab: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div
      style={{
        background: '#090c14',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f5f7fa' }}>
            Production Environment Secrets
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b93a3' }}>
            AES-256-GCM encrypted. Each version independently hashed.
          </div>
        </div>
        <button
          className="btn btn-cyan"
          style={{ fontSize: '0.78rem', padding: '6px 14px' }}
        >
          + Add Secret
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <th style={{ color: '#8b93a3' }}>Key Name</th>
              <th style={{ color: '#8b93a3' }}>Version</th>
              <th style={{ color: '#8b93a3' }}>Last Modified</th>
              <th style={{ color: '#8b93a3', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SECRETS_DATA.map((item) => (
              <tr key={item.key}>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f5f7fa', fontWeight: 600 }}>
                  {item.key}
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(94, 231, 255, 0.12)',
                      color: '#5ee7ff',
                      border: '1px solid rgba(94, 231, 255, 0.25)',
                    }}
                  >
                    {item.version}
                  </span>
                </td>
                <td style={{ color: '#8b93a3', fontSize: '0.75rem' }}>
                  {item.updated}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleCopy(item.key, item.val)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: copiedKey === item.key ? '#10b981' : '#cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedKey === item.key ? 'Copied ✓' : 'Copy'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
