import React from 'react';

const SPECS = [
  {
    label: 'Cipher & Derivation',
    value: 'AES-256-GCM · Argon2id',
    desc: '64MB memory cost, zero-knowledge client derivation.',
  },
  {
    label: 'Deployment Binary',
    value: 'Go Static (~18MB)',
    desc: 'Embedded SQLite in WAL mode. Zero external dependencies.',
  },
  {
    label: 'Injection Model',
    value: 'RAM-Only Pipeline',
    desc: 'Direct process execution via execve. Zero plaintext on disk.',
  },
  {
    label: 'Ledger Integrity',
    value: 'HMAC-SHA256 Chain',
    desc: 'Tamper-evident verification sequence for audit logs.',
  },
];

export const TrustProofBar: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '20px auto 0',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '28px 0',
        }}
      >
        {SPECS.map((spec) => (
          <div key={spec.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--vk-accent)',
                letterSpacing: '0.04em',
                fontWeight: 600,
              }}
            >
              {spec.label}
            </span>
            <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--vk-text)' }}>
              {spec.value}
            </span>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--vk-text-muted)', lineHeight: 1.4, margin: 0 }}>
              {spec.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
