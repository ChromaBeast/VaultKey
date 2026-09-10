import React, { useState } from 'react';

interface SecretRow {
  name: string;
  masked: string;
  revealed: string;
  accessed: string;
  principal: string;
}

const SECRETS: SecretRow[] = [
  { name: 'DATABASE_URL', masked: 'postgres://app:••••••••@prod-db:5432/main', revealed: 'postgres://app:p99#Xq7@prod-db:5432/main', accessed: '4m ago', principal: 'READ' },
  { name: 'STRIPE_SECRET_KEY', masked: 'sk_live_••••••••••••••••••••3f8', revealed: 'sk_live_98a44b1c78e3f8', accessed: '2h ago', principal: 'WRITE' },
  { name: 'OPENAI_API_KEY', masked: 'sk-proj-••••••••••••••••••••91x', revealed: 'sk-proj-k928aL4091x', accessed: '1d ago', principal: 'READ' },
  { name: 'AWS_ACCESS_KEY_ID', masked: 'AKIA••••••••••••90A', revealed: 'AKIA39XKLM890A', accessed: '3d ago', principal: 'ADMIN' },
];

export const HeroProductMockup: React.FC = () => {
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  const toggleReveal = (idx: number) => {
    setRevealedIndex(revealedIndex === idx ? null : idx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Vault Dashboard Mockup */}
      <div
        className="glass"
        style={{
          background: 'var(--vk-surface-1)',
          border: '1px solid var(--vk-border-strong)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--vk-shadow-pop)',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--vk-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b7a', display: 'inline-block' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f4c76a', display: 'inline-block' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#43d39e', display: 'inline-block' }} />
            <span style={{ marginLeft: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--vk-text)' }}>
              VaultKey Core
            </span>
            <span className="badge badge-read" style={{ fontSize: '0.65rem' }}>
              production
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.725rem', color: 'var(--vk-success)', fontFamily: 'monospace' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--vk-success)', display: 'inline-block' }} />
            AES-256-GCM
          </div>
        </div>

        {/* Secrets Table */}
        <div style={{ padding: '4px 12px' }}>
          <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--vk-border)' }}>
                <th style={{ padding: '8px 6px' }}>NAME</th>
                <th style={{ padding: '8px 6px' }}>VALUE (CLICK TO REVEAL)</th>
                <th style={{ padding: '8px 6px' }}>UPDATED</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>SCOPE</th>
              </tr>
            </thead>
            <tbody>
              {SECRETS.map((row, idx) => (
                <tr key={row.name} style={{ borderBottom: '1px solid var(--vk-border)' }}>
                  <td style={{ padding: '8px 6px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--vk-text)', fontWeight: 600 }}>
                    {row.name}
                  </td>
                  <td
                    onClick={() => toggleReveal(idx)}
                    style={{
                      padding: '8px 6px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: revealedIndex === idx ? 'var(--vk-success)' : 'var(--vk-text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                    title="Click to toggle reveal"
                  >
                    {revealedIndex === idx ? row.revealed : row.masked}
                  </td>
                  <td style={{ padding: '8px 6px', color: 'var(--vk-text-muted)', fontSize: '0.725rem' }}>
                    {row.accessed}
                  </td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                    <span className={`badge badge-${row.principal.toLowerCase()}`}>
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
            padding: '8px 16px',
            borderTop: '1px solid var(--vk-border)',
            fontSize: '0.725rem',
            color: 'var(--vk-text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            background: 'var(--vk-surface-2)',
          }}
        >
          <span>51 secrets · 3 environments</span>
          <span>4 members · ledger verified</span>
        </div>
      </div>

      {/* Terminal CLI Execution Visual */}
      <div
        style={{
          background: '#07090e',
          border: '1px solid var(--vk-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.78rem',
          boxShadow: 'var(--vk-shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--vk-accent)', marginBottom: '6px' }}>
          <span style={{ color: 'var(--vk-text-muted)' }}>$</span>
          <span style={{ fontWeight: 600 }}>vaultkey run -- npm start</span>
        </div>
        <div style={{ color: 'var(--vk-success)', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.74rem' }}>
          <div>✓ authenticated</div>
          <div>✓ vault unlocked (RAM-only key derivation)</div>
          <div>✓ 14 secrets injected into environment</div>
          <div style={{ color: 'var(--vk-text-muted)', marginTop: '2px' }}>
            [server] listening on https://api.internal:8080
          </div>
        </div>
      </div>
    </div>
  );
};
