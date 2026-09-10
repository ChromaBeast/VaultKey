import React from 'react';
import { Link } from 'react-router-dom';
import { HeroProductMockup } from './HeroProductMockup';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="animate-fade"
      style={{ maxWidth: '1200px', margin: '72px auto 0', padding: '0 24px' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '56px',
          alignItems: 'center',
        }}
      >
        {/* Left: Value Proposition */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(94, 231, 255, 0.1)',
              border: '1px solid rgba(94, 231, 255, 0.25)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: '#5ee7ff',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.06em',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#5ee7ff',
                boxShadow: '0 0 8px #5ee7ff',
              }}
            />
            SECRETS MANAGEMENT FOR ENGINEERING TEAMS
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              color: '#f5f7fa',
              marginBottom: '20px',
            }}
          >
            Keep secrets <br />
            <span style={{ color: '#5ee7ff' }}>out of code.</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#8b93a3',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '480px',
            }}
          >
            VaultKey gives your team one secure, centralized place for API keys, credentials,
            and production secrets — with controlled access and a developer-first workflow.
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/signup"
              className="btn btn-cyan"
              style={{ padding: '12px 24px', fontSize: '0.92rem', fontWeight: 600 }}
            >
              Get started free →
            </Link>
            <a
              href="#security"
              className="btn btn-secondary"
              style={{ padding: '12px 20px', fontSize: '0.92rem' }}
            >
              Explore the security model
            </a>
          </div>

          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              gap: '20px',
              fontSize: '0.78rem',
              color: '#586174',
              fontFamily: 'JetBrains Mono, monospace',
              flexWrap: 'wrap',
            }}
          >
            <span>• No credit card</span>
            <span>• CLI-first</span>
            <span>• Single-binary</span>
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
