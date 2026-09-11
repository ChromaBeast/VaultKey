import React from 'react';
import { ShieldCheck, Cpu, DatabaseZap, Lock } from 'lucide-react';

export const AuthHeroVisual: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '540px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 40px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 65% 35%, rgba(60, 237, 235, 0.08) 0%, rgba(6, 182, 212, 0.04) 45%, #020811 80%)',
        borderLeft: '1px solid var(--vk-border)',
      }}
    >
      {/* Background Matrix/Grid Accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Security Status Badge */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(60, 237, 235, 0.08)',
            border: '1px solid rgba(60, 237, 235, 0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--vk-accent)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', fontWeight: 600, color: 'var(--vk-accent)', letterSpacing: '0.04em' }}>
            ZERO-DISK RAM DERIVATION
          </span>
        </div>
      </div>

      {/* Center Cryptographic Core Showcase */}
      <div style={{ position: 'relative', zIndex: 1, margin: 'auto 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(60, 237, 235, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(60, 237, 235, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 50px rgba(60, 237, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            marginBottom: '28px',
          }}
        >
          <Lock size={48} color="var(--vk-accent)" strokeWidth={1.75} />
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '30px',
              border: '1px dashed rgba(60, 237, 235, 0.2)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%', maxWidth: '380px' }}>
          <div style={pillCardStyle}>
            <Cpu size={14} color="var(--vk-accent)" />
            <span>Argon2id · 64MB RAM</span>
          </div>
          <div style={pillCardStyle}>
            <ShieldCheck size={14} color="var(--vk-success)" />
            <span>AES-256-GCM Envelope</span>
          </div>
          <div style={pillCardStyle}>
            <DatabaseZap size={14} color="var(--vk-accent-secondary)" />
            <span>Chained HMAC Ledger</span>
          </div>
          <div style={pillCardStyle}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--vk-accent)' }} />
            <span>Immediate RAM Zeroing</span>
          </div>
        </div>
      </div>

      {/* Bottom Proof Quote */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.92rem', color: 'var(--vk-text)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
          &ldquo;Your secrets never touch disk. Derived fresh in RAM on unlock, zeroed on lock.&rdquo;
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--vk-text-muted)', marginTop: '6px', margin: 0 }}>
          Cryptographic zero-knowledge infrastructure for engineering teams.
        </p>
      </div>
    </div>
  );
};

const pillCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  background: 'rgba(18, 24, 36, 0.75)',
  border: '1px solid var(--vk-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.74rem',
  fontFamily: 'JetBrains Mono, monospace',
  color: 'var(--vk-text-secondary)',
  backdropFilter: 'blur(6px)',
};
