import React from 'react';

const POSITIONS = [
  {
    category: 'Legacy Approach',
    name: 'Plain .env Files',
    accent: '#ef4444',
    highlight: false,
    pros: ['Zero initial learning curve', 'Familiar to every developer', 'No server setup needed'],
    cons: ['Accidental commits to git', 'No access controls or revocation', 'Zero audit trail for leaks'],
  },
  {
    category: 'The Sweet Spot',
    name: 'VaultKey',
    accent: '#5ee7ff',
    highlight: true,
    pros: [
      'Single-binary self-host in 60s',
      'Zero plaintext touches disk',
      'Scoped tokens & machine principals',
      'Tamper-evident HMAC audit trail',
    ],
    cons: ['Not designed for complex 10k-person dynamic PKI hierarchies'],
  },
  {
    category: 'Enterprise Heavyweight',
    name: 'HashiCorp Vault',
    accent: '#818cf8',
    highlight: false,
    pros: ['Extensive dynamic cloud secrets', 'Comprehensive PKI engine', 'Enterprise policy governance'],
    cons: ['Heavy infrastructure maintenance', 'Steep learning curve & complex setup', 'Requires dedicated Ops personnel'],
  },
];

export const PositioningCards: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
      {POSITIONS.map((pos) => (
        <div
          key={pos.name}
          className={pos.highlight ? 'glass-glow' : 'glass'}
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: pos.highlight ? 'rgba(14, 18, 27, 0.95)' : 'rgba(14, 18, 27, 0.5)',
            border: pos.highlight ? '1px solid rgba(94, 231, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: pos.accent, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, marginBottom: '6px' }}>
              {pos.category}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f5f7fa', marginBottom: '18px' }}>
              {pos.name}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                Strengths:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pos.pros.map((p) => (
                  <li key={p} style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                Trade-offs:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pos.cons.map((c) => (
                  <li key={c} style={{ fontSize: '0.8rem', color: '#8b93a3', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
