import React from 'react';

const CELLS = [
  {
    title: 'Argon2id Key Derivation',
    body: 'Master key derived in RAM with 64 MB memory bounds on every unlock. Zeroed on lock. Never written to disk or logs.',
    accent: '#6366f1',
    tag: 'KDF',
    wide: true,
    mono: 'Argon2id · m=64MB · t=3 · p=4',
  },
  {
    title: 'AES-256-GCM Encryption',
    body: 'Each secret encrypted individually with a random 12-byte nonce. Authenticated encryption — tampering is detectable.',
    accent: '#10b981',
    tag: 'ENC',
    wide: false,
    mono: 'AES-256-GCM · 12-byte nonce',
  },
  {
    title: 'HMAC-SHA256 Audit Ledger',
    body: 'Every event chained to the previous entry hash. Delete or reorder any row and the chain breaks. SOC 2 ready.',
    accent: '#f59e0b',
    tag: 'AUDIT',
    wide: false,
    mono: 'HMAC-SHA256 · Immutable chain',
  },
  {
    title: 'Scoped Access Tokens',
    body: 'Fine-grained READ / WRITE / ADMIN tokens scoped per project. CI workers get the minimum they need — nothing more.',
    accent: '#06b6d4',
    tag: 'IAM',
    wide: false,
    mono: 'Per-project · Per-role',
  },
  {
    title: '1-Time Self-Destruct Links',
    body: 'Share credentials via ephemeral links that auto-purge after a single view or TTL expiry. No plaintext in transit logs.',
    accent: '#8b5cf6',
    tag: 'SHARE',
    wide: false,
    mono: 'max_views=1 · TTL enforced',
  },
];

export const BentoGridSection: React.FC = () => {
  return (
    <section id="features" style={{ maxWidth: '1200px', margin: '100px auto 0', padding: '0 24px' }}>
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f8fafc',
            marginBottom: '10px',
          }}
        >
          Zero-Trust Security Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.6 }}>
          Every layer is built around one constraint: your master key exists only in RAM.
        </p>
      </div>

      {/* Bento: 2-col, first cell spans full width */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '16px',
        }}
      >
        {/* Wide cell — spans 2 cols, has dark accent background */}
        <div
          className="glass-glow"
          style={{
            gridColumn: '1 / -1',
            padding: '32px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 320px' }}>
            <span
              className="code-font"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#6366f1',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              KDF
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#f8fafc',
                marginBottom: '10px',
                letterSpacing: '-0.02em',
              }}
            >
              Argon2id Key Derivation
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: '380px' }}>
              Master key derived in RAM with 64 MB memory bounds on every unlock. Zeroed on lock.
              Never written to disk or logs.
            </p>
          </div>

          {/* Spec block on the right */}
          <div
            style={{
              background: '#090c14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '18px 22px',
              flex: '0 0 auto',
              minWidth: '240px',
            }}
          >
            <div className="code-font" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              {[
                ['Algorithm', 'Argon2id'],
                ['Memory', '64 MB'],
                ['Iterations', '3'],
                ['Parallelism', '4 threads'],
                ['Output', '32-byte AES key'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Remaining 4 cells — 2x2 */}
        {CELLS.slice(1).map((cell) => (
          <div
            key={cell.title}
            className="glass"
            style={{
              padding: '26px 28px',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <span
              className="code-font"
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: cell.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {cell.tag}
            </span>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '-0.015em',
              }}
            >
              {cell.title}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.65, flex: 1 }}>
              {cell.body}
            </p>
            <div
              className="code-font"
              style={{
                fontSize: '0.7rem',
                color: cell.accent,
                background: `${cell.accent}12`,
                border: `1px solid ${cell.accent}25`,
                padding: '4px 10px',
                borderRadius: '6px',
                alignSelf: 'flex-start',
              }}
            >
              {cell.mono}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
