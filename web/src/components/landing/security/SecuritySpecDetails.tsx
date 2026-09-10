import React, { useState } from 'react';

const SPECS = [
  { label: 'Symmetric Cipher', value: 'AES-256-GCM', detail: 'Authenticated 256-bit Galois/Counter Mode encryption. Tampering with any byte invalidates tag verification.' },
  { label: 'Key Derivation (KDF)', value: 'Argon2id (m=64MB, t=3, p=4)', detail: 'Memory-hard derivation designed to resist parallelized GPU and ASIC dictionary attacks.' },
  { label: 'Nonce Management', value: '12-byte CSPRNG per write', detail: 'Fresh cryptographically secure random bytes generated for each record encryption; never reused.' },
  { label: 'Audit Integrity', value: 'HMAC-SHA256 Chained Ledger', detail: 'Every log entry is cryptographically bound to the hash of the preceding entry. Reordering or deleting rows is impossible.' },
  { label: 'Process Memory', value: 'Memguard zeroed on lock', detail: 'Key material in memory is held in non-swappable locked pages and overwritten with zeros immediately upon locking.' },
];

export const SecuritySpecDetails: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div
      style={{
        background: '#090c14',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
          Cryptographic Technical Specifications
        </span>
        <span style={{ fontSize: '0.72rem', color: '#8b93a3', fontFamily: 'JetBrains Mono, monospace' }}>
          Zero Plaintext at Rest
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {SPECS.map((spec, idx) => (
          <div
            key={spec.label}
            style={{
              borderBottom: idx < SPECS.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
              padding: '12px 20px',
            }}
          >
            <div
              onClick={() => toggle(idx)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: '#8b93a3' }}>{spec.label}</span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8rem',
                    color: '#5ee7ff',
                    fontWeight: 600,
                  }}
                >
                  {spec.value}
                </span>
              </div>
              <span style={{ color: '#8b93a3', fontSize: '0.8rem' }}>
                {openIndex === idx ? '▲' : '▼'}
              </span>
            </div>
            {openIndex === idx && (
              <p
                style={{
                  marginTop: '8px',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  paddingLeft: '4px',
                }}
              >
                {spec.detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
