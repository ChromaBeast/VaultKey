import React from 'react';

const FLOW_STEPS = [
  {
    step: '01',
    title: 'Master Secret',
    subtitle: 'Supplied during unlock',
    desc: 'Never written to disk or logs. Zeroed from memory immediately after derivation.',
    badge: 'USER INPUT',
  },
  {
    step: '02',
    title: 'Argon2id KDF',
    subtitle: 'Memory-hard derivation',
    desc: 'Derived with 64 MB memory bounds to render GPU/ASIC brute-force economically impossible.',
    badge: 'RAM BOUND',
  },
  {
    step: '03',
    title: 'Derived Key in RAM',
    subtitle: 'Ephemeral symmetric key',
    desc: 'Held securely in locked RAM pages. Erased the moment the vault lock is triggered.',
    badge: 'ZERO DISK',
  },
  {
    step: '04',
    title: 'AES-256-GCM Cipher',
    subtitle: 'Authenticated encryption',
    desc: 'Each secret encrypted individually with a fresh 12-byte CSPRNG nonce. Tamper-evident.',
    badge: 'ENCRYPTION',
  },
  {
    step: '05',
    title: 'Encrypted Vault',
    subtitle: 'Local SQLite WAL storage',
    desc: 'Database contains only encrypted ciphertexts and chained HMAC audit hashes.',
    badge: 'AT REST',
  },
];

export const SecurityFlowDiagram: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        margin: '32px 0',
      }}
    >
      {FLOW_STEPS.map((item, index) => (
        <div
          key={item.step}
          className="glass"
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(14, 18, 27, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5ee7ff', fontWeight: 700 }}>
                {item.step}
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.62rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(94, 231, 255, 0.1)',
                  color: '#5ee7ff',
                  border: '1px solid rgba(94, 231, 255, 0.2)',
                }}
              >
                {item.badge}
              </span>
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f5f7fa', marginBottom: '4px' }}>
              {item.title}
            </h4>
            <div style={{ fontSize: '0.72rem', color: '#818cf8', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px' }}>
              {item.subtitle}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#8b93a3', lineHeight: 1.5, margin: 0 }}>
              {item.desc}
            </p>
          </div>
          {index < FLOW_STEPS.length - 1 && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '0.75rem',
                color: '#5ee7ff',
                fontFamily: 'JetBrains Mono, monospace',
                textAlign: 'right',
              }}
            >
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
