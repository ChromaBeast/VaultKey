import React from 'react';
import { Link } from 'react-router-dom';
import { HeroProductMockup } from './HeroProductMockup';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="animate-fade"
      style={{ maxWidth: '1240px', margin: '64px auto 0', padding: '0 24px' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Left: Value Proposition */}
        <div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              color: 'var(--vk-text)',
              marginBottom: '18px',
            }}
          >
            Secrets in runtime memory. <br />
            <span style={{ color: 'var(--vk-accent)' }}>Never on disk.</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--vk-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '480px',
            }}
          >
            A single-binary secrets engine for engineering teams.
            Inject encrypted credentials directly into process memory via Argon2id and AES-256-GCM.
            Zero cloud dependencies, embedded SQLite, and an immutable HMAC audit ledger.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              Get Started
            </Link>
            <a
              href="#architecture"
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              View Architecture
            </a>
          </div>

          <div
            style={{
              marginTop: '22px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--vk-surface-1)',
              border: '1px solid var(--vk-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 14px',
              fontSize: '0.78rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--vk-text-secondary)',
            }}
          >
            <span style={{ color: 'var(--vk-accent)', fontWeight: 700 }}>$</span>
            <span>curl -sSL https://vaultkey.sh/install | sh</span>
          </div>
        </div>

        {/* Right: Realistic Product UI Mockup */}
        <div style={{ width: '100%' }}>
          <HeroProductMockup />
        </div>
      </div>
    </section>
  );
};
