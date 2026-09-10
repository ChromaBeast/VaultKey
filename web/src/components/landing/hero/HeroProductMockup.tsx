import React, { useState } from 'react';

interface SecretRow {
  name: string;
  masked: string;
  revealed: string;
  accessed: string;
  principal: string;
}

const SECRETS: SecretRow[] = [
  { name: 'STRIPE_SECRET_KEY', masked: 'sk_live_••••••••••••••••••••3f8', revealed: 'sk_live_98a44b1c78e3f8', accessed: '2m ago by CI', principal: 'CI/CD' },
  { name: 'DATABASE_URL', masked: 'postgres://app:••••••••@prod-db:5432/main', revealed: 'postgres://app:p99#Xq7@prod-db:5432/main', accessed: '14m ago', principal: 'Prod API' },
  { name: 'OPENAI_API_KEY', masked: 'sk-proj-••••••••••••••••••••91x', revealed: 'sk-proj-k928aL4091x', accessed: '1h ago', principal: 'Backend' },
  { name: 'AWS_ACCESS_KEY_ID', masked: 'AKIA••••••••••••90A', revealed: 'AKIA39XKLM890A', accessed: '3h ago', principal: 'Workers' },
];

export const HeroProductMockup: React.FC = () => {
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  const toggleReveal = (idx: number) => {
    setRevealedIndex(revealedIndex === idx ? null : idx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Vault Dashboard Mockup */}
      <div
        className="glass"
        style={{
          background: '#0e121b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ marginLeft: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
              VaultKey Core
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#5ee7ff',
                background: 'rgba(94, 231, 255, 0.1)',
                border: '1px solid rgba(94, 231, 255, 0.25)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              production
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#10b981' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Encrypted (Zero-Disk)
          </div>
        </div>

        {/* Secrets Table */}
        <div style={{ padding: '8px 16px' }}>
          <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <th style={{ padding: '10px 8px', color: '#8b93a3', fontWeight: 500 }}>Secret Name</th>
                <th style={{ padding: '10px 8px', color: '#8b93a3', fontWeight: 500 }}>Value</th>
                <th style={{ padding: '10px 8px', color: '#8b93a3', fontWeight: 500 }}>Last Accessed</th>
                <th style={{ padding: '10px 8px', color: '#8b93a3', fontWeight: 500 }}>Scope</th>
              </tr>
            </thead>
            <tbody>
              {SECRETS.map((row, idx) => (
                <tr key={row.name} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono, monospace', color: '#f5f7fa', fontWeight: 600 }}>
                    {row.name}
                  </td>
                  <td
                    onClick={() => toggleReveal(idx)}
                    style={{
                      padding: '10px 8px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: revealedIndex === idx ? '#5ee7ff' : '#8b93a3',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                    }}
                    title="Click to toggle reveal"
                  >
                    {revealedIndex === idx ? row.revealed : row.masked}
                  </td>
                  <td style={{ padding: '10px 8px', color: '#8b93a3', fontSize: '0.75rem' }}>
                    {row.accessed}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: '#818cf8',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                      }}
                    >
                      {row.principal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Meta */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.75rem',
            color: '#8b93a3',
            display: 'flex',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <span>14 secrets configured</span>
          <span>4 members · 2 machine principals</span>
        </div>
      </div>

      {/* Terminal CLI Execution Visual */}
      <div
        style={{
          background: '#06070b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '14px 18px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.8rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5ee7ff', marginBottom: '8px' }}>
          <span style={{ color: '#8b93a3' }}>$</span>
          <span style={{ fontWeight: 600 }}>vaultkey run -- npm run start</span>
        </div>
        <div style={{ color: '#10b981', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.76rem' }}>
          <div>✓ Vault unlocked (Argon2id derived in RAM)</div>
          <div>✓ Principal verified (Scope: production-worker)</div>
          <div>✓ 14 secrets injected into process memory (0 on disk)</div>
          <div style={{ color: '#8b93a3', marginTop: '4px' }}>
            [server] listening on https://api.internal:8080
          </div>
        </div>
      </div>
    </div>
  );
};
