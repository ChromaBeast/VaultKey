import React from 'react';
import { Terminal, Lock } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--vk-surface-1)',
        border: '1px solid var(--vk-border)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      }}>
        {/* Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'var(--vk-surface-2)',
          borderBottom: '1px solid var(--vk-border)',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308', display: 'block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
          </div>
          {/* Session label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--vk-text-muted)' }}>
            <Terminal size={12} style={{ color: 'var(--vk-accent)' }} />
            vaultkey-runtime · pid 8192
          </div>
          {/* RAM badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.6rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--vk-success)',
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.25)',
            padding: '2px 7px',
            borderRadius: '4px',
          }}>
            <Lock size={9} />
            MLOCK
          </div>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7 }}>
          {/* Command */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--vk-accent)', fontWeight: 700 }}>$</span>
            <span>
              <span style={{ color: 'var(--vk-text)', fontWeight: 600 }}>vaultkey run</span>
              {' '}<span style={{ color: 'var(--vk-accent)' }}>--env=production</span>
              {' '}<span style={{ color: 'var(--vk-text-muted)' }}>-- npm start</span>
            </span>
          </div>

          {/* Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', marginBottom: '16px' }}>
            {[
              { text: '14 secrets decrypted into process RAM (1.2ms)', success: true },
              { text: 'Memory locked via mlock(2) · zero disk footprint', success: true },
              { text: 'Spawned isolated child process (PID 8192)', success: false },
              { text: 'Server listening on http://localhost:3000', success: false },
            ].map(({ text, success }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: success ? 'var(--vk-success)' : 'var(--vk-text-muted)' }}>
                <span style={{ flexShrink: 0, userSelect: 'none' }}>✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid var(--vk-border)', paddingTop: '14px', fontSize: '0.65rem', textAlign: 'center' }}>
            {[
              { label: 'Disk Leak', value: '0 bytes', accent: 'var(--vk-success)' },
              { label: 'Cipher', value: 'AES-256-GCM', accent: 'var(--vk-text)' },
              { label: 'RAM State', value: 'Protected', accent: 'var(--vk-accent)' },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ background: 'var(--vk-surface-2)', padding: '8px 4px', borderRadius: '6px', border: '1px solid var(--vk-border)' }}>
                <div style={{ color: 'var(--vk-text-muted)' }}>{label}</div>
                <div style={{ color: accent, fontWeight: 700, marginTop: '3px' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
