import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const snippets = {
  cli: `$ vaultkey unlock
[vaultkey] Deriving master key — Argon2id (64MB, t=3, p=4)...
[vaultkey] Vault unlocked. Master key in RAM only.

$ vaultkey run -- node index.js
[vaultkey] Injected 14 secrets into process environment.
[vaultkey] No plaintext written to disk.
✓  Server listening on :8080`,

  sdk: `import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({ apiKey: process.env.VK_TOKEN });

// Inject all project secrets into process.env — in RAM only
await vk.inject('backend', 'production');

// Or fetch a single secret on-demand
const uri = await vk.get('DATABASE_URL');`,

  go: `vk := client.NewClient(os.Getenv("VAULTKEY_SERVER"), token)

secret, err := vk.GetSecret("DATABASE_URL")
if err != nil {
    log.Fatal(err)
}
// secret.Value exists only in this process scope
// Nothing written to disk`,
};

export const HeroSection: React.FC = () => {
  const [tab, setTab] = useState<'cli' | 'sdk' | 'go'>('cli');

  return (
    <section
      className="animate-fade"
      style={{ maxWidth: '1200px', margin: '72px auto 0', padding: '0 24px' }}
    >
      {/* Left-aligned hero layout — breaks the centered AI default */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
        {/* Left: copy */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              color: '#34d399',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.04em',
              marginBottom: '28px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            ZERO-DISK ARCHITECTURE
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              color: '#f8fafc',
              marginBottom: '20px',
            }}
          >
            Secrets that never{' '}
            <span style={{ color: '#818cf8' }}>touch disk.</span>{' '}
            Not ever.
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '420px',
            }}
          >
            Master key derived fresh in RAM on every unlock. Zeroed the moment the vault locks.
            No plaintext at rest. No exceptions.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ padding: '11px 22px', fontSize: '0.9rem', fontWeight: 600 }}
            >
              Start Free
            </Link>
            <Link
              to="/docs"
              className="btn btn-secondary"
              style={{ padding: '11px 18px', fontSize: '0.9rem' }}
            >
              Read Architecture
            </Link>
          </div>

          <div
            style={{
              marginTop: '36px',
              display: 'flex',
              gap: '28px',
              fontSize: '0.8rem',
              color: '#64748b',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {['Argon2id · AES-256-GCM', 'HMAC-SHA256 Audit Chain', 'India-first pricing'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right: terminal code block */}
        <div
          className="glass-glow"
          style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['cli', 'sdk', 'go'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="code-font"
                  style={{
                    background: tab === t ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                    color: tab === t ? '#818cf8' : '#64748b',
                    border: `1px solid ${tab === t ? 'rgba(99, 102, 241, 0.35)' : 'transparent'}`,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Code */}
          <pre
            className="code-font"
            style={{
              fontSize: '0.82rem',
              color: '#94a3b8',
              margin: 0,
              padding: '20px 20px 24px',
              overflowX: 'auto',
              lineHeight: 1.7,
              minHeight: '160px',
              whiteSpace: 'pre',
            }}
          >
            <code style={{ color: '#34d399' }}>{snippets[tab]}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
