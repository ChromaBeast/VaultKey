import React from 'react';

const PILLARS = [
  {
    title: 'Zero-Knowledge',
    desc: 'Plaintext secrets live in RAM during injection and never touch disk.',
  },
  {
    title: 'Self-Hostable',
    desc: 'Single static Go binary with embedded SQLite. Zero external database required.',
  },
  {
    title: 'CLI-First',
    desc: 'Inject secrets into npm, Docker, Python, or CI workflows in one command.',
  },
  {
    title: 'Audit-Ready',
    desc: 'Every access and rotation verified via a tamper-evident HMAC-SHA256 chain.',
  },
];

export const TrustProofBar: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '64px auto 0',
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
        {PILLARS.map((pillar) => (
          <div key={pillar.title} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f7fa' }}>
                {pillar.title}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8b93a3', lineHeight: 1.5, margin: 0 }}>
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
