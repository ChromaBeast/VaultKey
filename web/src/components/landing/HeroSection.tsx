import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const [tab, setTab] = useState<'cli' | 'sdk' | 'docker'>('cli');

  const snippets = {
    cli: `$ vaultkey run -- npm start\n[vaultkey] Unlocking Zero-Knowledge Vault (org: acme-corp)...\n[vaultkey] Deriving master key via Argon2id (memory: 64MB, threads: 4)...\n[vaultkey] Decrypted 14 secrets into process RAM environment.\n✓ Server listening on https://api.acme.internal:8080`,
    sdk: `package main\n\nimport "vaultkey/client"\n\nfunc main() {\n    vk := client.NewClient("http://localhost:8080", "vk_live_89f3a12")\n    secret, _ := vk.GetSecret("DATABASE_URL")\n    println("Decrypted secret:", secret)\n}`,
    docker: `version: '3.8'\nservices:\n  app:\n    image: acme/api:latest\n    environment:\n      - VAULTKEY_TOKEN=vk_live_89f3a12\n    command: ["vaultkey", "run", "--", "node", "index.js"]`,
  };

  return (
    <section className="animate-fade" style={{ maxWidth: '1200px', margin: '60px auto 40px', padding: '0 24px', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          color: '#818cf8',
          fontWeight: 600,
          marginBottom: '20px',
        }}
      >
        <span style={{ fontSize: '0.75rem' }}>⚡</span> Go 1.26.5 & Zero-Knowledge Architecture
      </div>

      <h1
        style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.1,
          maxWidth: '920px',
          margin: '0 auto 18px',
          color: '#f8fafc',
        }}
      >
        End-to-End Encrypted Secrets for Modern Engineering Teams
      </h1>

      <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6 }}>
        Centralize your API keys, env variables, and production tokens with RAM-derived zero-knowledge encryption and audit logs.
      </p>

      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '48px' }}>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          Start Free Vault →
        </Link>
        <Link to="/docs" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
          Read Architecture
        </Link>
      </div>

      {/* Terminal Code Component */}
      <div className="glass-glow" style={{ padding: '20px', borderRadius: '16px', textAlign: 'left', maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['cli', 'sdk', 'docker'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="code-font"
                style={{
                  background: tab === t ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: tab === t ? '#818cf8' : '#94a3b8',
                  border: '1px solid ' + (tab === t ? 'rgba(99, 102, 241, 0.4)' : 'transparent'),
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <pre className="code-font" style={{ fontSize: '0.85rem', color: '#34d399', margin: 0, overflowX: 'auto', lineHeight: 1.6, minHeight: '110px' }}>
          <code>{snippets[tab]}</code>
        </pre>
      </div>
    </section>
  );
};
