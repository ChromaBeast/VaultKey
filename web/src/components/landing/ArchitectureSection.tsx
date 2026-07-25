import React from 'react';

const SPEC_ROWS = [
  ['Symmetric Cipher', 'AES-256-GCM'],
  ['Key Derivation', 'Argon2id (m=64MB, t=3, p=4)'],
  ['Nonce', '12-byte CSPRNG per secret'],
  ['Audit Integrity', 'HMAC-SHA256 chain'],
  ['Architecture', 'Self-contained compiled binary'],
  ['Storage Engine', 'SQLite WAL mode'],
  ['Container Size', '< 25 MB Docker image'],
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section
      id="architecture"
      style={{ maxWidth: '1200px', margin: '100px auto 0', padding: '0 24px' }}
    >
      <div
        className="glass"
        style={{
          padding: '48px',
          borderRadius: '18px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '56px',
          alignItems: 'start',
        }}
      >
        {/* Left: copy */}
        <div>
          <h2
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '16px',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            One binary. No external dependencies.
          </h2>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.9rem',
              lineHeight: 1.75,
              marginBottom: '28px',
            }}
          >
            VaultKey ships as a single compiled binary with the React frontend embedded.
            No Node.js runtime, no Redis sidecar, no managed KMS you don't control.
            Drop it in a Docker container and it runs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'SQLite WAL journaling — automatic busy-handler retry on write contention',
              'Embed directive bakes the React SPA directly into the binary at compile time',
              'Self-hostable on any VPS — full data sovereignty, no cloud lock-in',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    color: '#34d399',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.85rem',
                    marginTop: '1px',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: spec table */}
        <div
          style={{
            background: '#090c14',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              className="code-font"
              style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              CRYPTOGRAPHIC SPECIFICATION
            </span>
            <span
              className="code-font"
              style={{
                fontSize: '0.65rem',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              VERIFIED
            </span>
          </div>

          <div className="code-font" style={{ padding: '6px 0' }}>
            {SPEC_ROWS.map(([key, val], i) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 18px',
                  borderBottom: i < SPEC_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  gap: '16px',
                }}
              >
                <span style={{ color: '#64748b', fontSize: '0.78rem', flexShrink: 0 }}>{key}</span>
                <span style={{ color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, textAlign: 'right' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
