import React from 'react';

const PIPELINE_STEPS = [
  {
    step: '01',
    tag: 'DERIVATION',
    title: 'Client-Side KDF',
    desc: 'Master secret is derived via Argon2id (m=64MB, t=3, p=4) purely on the client. The master key never leaves local memory.',
  },
  {
    step: '02',
    tag: 'RAM BUFFER',
    title: 'Locked Memory Page',
    desc: 'Decrypted secrets reside in locked RAM pages (mlock) protected against swap paging, core dumps, and inter-process reads.',
  },
  {
    step: '03',
    tag: 'INJECTION',
    title: 'Process Execve',
    desc: 'VaultKey launches the target child process directly, passing decrypted environment variables into its memory space.',
  },
  {
    step: '04',
    tag: 'ZEROIZATION',
    title: 'Atomic Scrub',
    desc: 'The instant the child process terminates, all decrypted memory buffers are wiped with zeroes and the vault re-locks.',
  },
];

const ARCH_ATTRIBUTES = [
  { label: 'Storage Engine', val: 'Embedded SQLite in WAL mode' },
  { label: 'Cipher Suite', val: 'AES-256-GCM + CSPRNG 12B nonces' },
  { label: 'Audit Verification', val: 'HMAC-SHA256 chained hash ledger' },
  { label: 'Distribution', val: 'Single static Go binary (zero deps)' },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section
      id="architecture"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '720px', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#6366f1',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Security Architecture
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f5f7fa',
            lineHeight: 1.2,
            marginTop: '8px',
            marginBottom: '16px',
          }}
        >
          Memory-only pipeline. Zero plaintext on disk.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
          Most secret leaks occur because dot-env files sit unencrypted on developer laptops or in CI cache disks.
          VaultKey keeps secrets strictly in RAM during execution and securely encrypted at rest.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {PIPELINE_STEPS.map((s) => (
          <div
            key={s.step}
            className="glass"
            style={{
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(14, 18, 27, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#6366f1', fontWeight: 700 }}>
                  {s.step}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  {s.tag}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f5f7fa', marginBottom: '8px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#8b93a3', lineHeight: 1.5, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '20px 24px',
          borderRadius: '12px',
          background: 'rgba(10, 14, 22, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {ARCH_ATTRIBUTES.map((attr) => (
          <div key={attr.label}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              {attr.label}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
              {attr.val}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
