import React from 'react';

interface AuditEntry {
  time: string;
  actor: string;
  action: 'READ' | 'WRITE' | 'REVOKE' | 'INJECT';
  target: string;
  hash: string;
}

const AUDIT_LOGS: AuditEntry[] = [
  { time: '12:42:08', actor: 'sheersh', action: 'READ', target: 'STRIPE_SECRET_KEY', hash: '8f9ba01e4c32' },
  { time: '12:39:17', actor: 'ci-prod', action: 'INJECT', target: 'DATABASE_URL', hash: '3c12948ea110' },
  { time: '11:51:02', actor: 'alice', action: 'WRITE', target: 'OPENAI_API_KEY (v4)', hash: '7a8801cdfe49' },
  { time: '09:14:22', actor: 'sheersh', action: 'REVOKE', target: 'token:stg-temp-token', hash: 'b490cc1124e9' },
];

export const ShowcaseAuditTab: React.FC = () => {
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
            Cryptographic Audit Ledger
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b93a3' }}>
            Tamper-evident log chaining each entry to previous row hash.
          </div>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '4px 10px',
            borderRadius: '6px',
          }}
        >
          HMAC-SHA256 Chain Intact ✓
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <th style={{ color: '#8b93a3' }}>Timestamp</th>
              <th style={{ color: '#8b93a3' }}>Principal</th>
              <th style={{ color: '#8b93a3' }}>Action</th>
              <th style={{ color: '#8b93a3' }}>Target Secret</th>
              <th style={{ color: '#8b93a3' }}>Entry Hash</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOGS.map((log) => (
              <tr key={log.hash}>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#8b93a3', fontSize: '0.75rem' }}>
                  {log.time}
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f5f7fa', fontWeight: 600 }}>
                  {log.actor}
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background:
                        log.action === 'WRITE' ? 'rgba(16, 185, 129, 0.12)' :
                        log.action === 'READ' ? 'rgba(99, 102, 241, 0.12)' :
                        log.action === 'INJECT' ? 'rgba(94, 231, 255, 0.12)' :
                        'rgba(239, 68, 68, 0.12)',
                      color:
                        log.action === 'WRITE' ? '#34d399' :
                        log.action === 'READ' ? '#818cf8' :
                        log.action === 'INJECT' ? '#5ee7ff' :
                        '#f87171',
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#cbd5e1', fontSize: '0.78rem' }}>
                  {log.target}
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', color: '#586174', fontSize: '0.72rem' }}>
                  {log.hash}…
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
