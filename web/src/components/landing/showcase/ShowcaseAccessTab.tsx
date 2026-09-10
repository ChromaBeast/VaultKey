import React from 'react';

interface Principal {
  name: string;
  type: 'Human' | 'Machine Token';
  role: 'ADMIN' | 'WRITE' | 'READ';
  scope: string;
  roleColor: string;
}

const PRINCIPALS: Principal[] = [
  { name: 'sheersh', type: 'Human', role: 'ADMIN', scope: 'All Environments', roleColor: '#f59e0b' },
  { name: 'alice', type: 'Human', role: 'WRITE', scope: 'Staging, Development', roleColor: '#10b981' },
  { name: 'ci-prod-worker', type: 'Machine Token', role: 'READ', scope: 'Production (Injection only)', roleColor: '#5ee7ff' },
  { name: 'staging-preview-bot', type: 'Machine Token', role: 'READ', scope: 'Staging Ephemeral', roleColor: '#818cf8' },
];

export const ShowcaseAccessTab: React.FC = () => {
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
            Production Access Control & Principals
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b93a3' }}>
            Enforce least-privilege tokens for both team engineers and automated services.
          </div>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
          + Add Principal
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <th style={{ color: '#8b93a3' }}>Principal</th>
              <th style={{ color: '#8b93a3' }}>Type</th>
              <th style={{ color: '#8b93a3' }}>Role</th>
              <th style={{ color: '#8b93a3' }}>Scope</th>
            </tr>
          </thead>
          <tbody>
            {PRINCIPALS.map((p) => (
              <tr key={p.name}>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f5f7fa', fontWeight: 600 }}>
                  {p.name}
                </td>
                <td style={{ color: '#8b93a3', fontSize: '0.75rem' }}>
                  {p.type}
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: `${p.roleColor}18`,
                      color: p.roleColor,
                      border: `1px solid ${p.roleColor}35`,
                    }}
                  >
                    {p.role}
                  </span>
                </td>
                <td style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                  {p.scope}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
