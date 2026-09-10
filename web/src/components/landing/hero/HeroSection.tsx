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
            Keep secrets <br />
            <span style={{ color: 'var(--vk-accent)' }}>out of code.</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--vk-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '460px',
            }}
          >
            VaultKey gives engineering teams a secure place for API keys, credentials,
            environment secrets, and machine access — with scoped permissions, version history,
            and an auditable access trail.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ padding: '11px 22px', fontSize: '0.88rem' }}
            >
              Get started free →
            </Link>
            <a
              href="#security"
              className="btn btn-secondary"
              style={{ padding: '11px 18px', fontSize: '0.88rem' }}
            >
              Explore security
            </a>
          </div>

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              gap: '16px',
              fontSize: '0.75rem',
              color: 'var(--vk-text-muted)',
              fontFamily: 'JetBrains Mono, monospace',
              flexWrap: 'wrap',
            }}
          >
            <span>• No credit card</span>
            <span>• CLI-first</span>
            <span>• Built for developers</span>
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
