import React from 'react';

const SCATTER_POINTS = [
  { label: '.env files', note: 'Checked into git or left on desktop', risk: 'HIGH RISK' },
  { label: 'Slack & Email', note: 'Shared in DMs when onboarding devs', risk: 'UNAUDITED' },
  { label: 'GitHub Actions', note: 'Duplicated repo-by-repo manually', risk: 'STALE SYNC' },
  { label: 'Docker Compose', note: 'Hardcoded in staging containers', risk: 'LEAK HAZARD' },
  { label: 'Production Servers', note: 'Static config files stored on disk', risk: 'PERSISTENT' },
  { label: 'Local Laptops', note: 'Left in shell history & bashrc', risk: 'UNTRACKED' },
];

export const ScatteredSecretsVisual: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'stretch',
      }}
    >
      {/* Left: Secrets Sprawl Cards */}
      <div
        className="glass"
        style={{
          padding: '28px',
          borderRadius: '16px',
          background: 'rgba(14, 18, 27, 0.6)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f87171' }}>
            The Sprawl: Secrets Scattered Across Teams
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SCATTER_POINTS.map((pt) => (
            <div
              key={pt.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                fontSize: '0.8rem',
              }}
            >
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f5f7fa', fontWeight: 600 }}>
                  {pt.label}
                </div>
                <div style={{ color: '#8b93a3', fontSize: '0.72rem' }}>{pt.note}</div>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#f87171',
                  background: 'rgba(239, 68, 68, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                {pt.risk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: The Controlled VaultKey Home */}
      <div
        className="glass-glow"
        style={{
          padding: '28px',
          borderRadius: '16px',
          background: 'rgba(14, 18, 27, 0.9)',
          border: '1px solid rgba(94, 231, 255, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5ee7ff' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#5ee7ff' }}>
              The Solution: One Controlled Source of Truth
            </h3>
          </div>

          <p style={{ color: '#8b93a3', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Instead of copying plaintext strings across unmonitored channels, VaultKey acts as an
            isolated cryptographic clearinghouse. Plaintext credentials never persist on client disks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            {[
              'Scoped access rules for engineers and automated CI runners',
              'Real-time cryptographic revocation without redeploying code',
              'Sub-second injection directly into process RAM at startup',
              'Chained HMAC-SHA256 audit ledger tracking every single read',
            ].map((feature) => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f7fa' }}>
                <span style={{ color: '#5ee7ff', fontWeight: 700 }}>✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(94, 231, 255, 0.05)',
            border: '1px solid rgba(94, 231, 255, 0.15)',
            fontSize: '0.78rem',
            color: '#cbd5e1',
          }}
        >
          💡 <strong>Zero sprawl guarantee:</strong> Secrets are queried dynamically on-demand and zeroed immediately upon container termination.
        </div>
      </div>
    </div>
  );
};
