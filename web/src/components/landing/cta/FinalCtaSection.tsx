import React from 'react';
import { Link } from 'react-router-dom';

export const FinalCtaSection: React.FC = () => {
  return (
    <section style={{ maxWidth: '1240px', margin: '100px auto 0', padding: '0 24px', textAlign: 'center' }}>
      <div
        className="glass"
        style={{
          padding: '64px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(180deg, var(--vk-surface-1) 0%, var(--vk-surface-2) 100%)',
          border: '1px solid var(--vk-border-strong)',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--vk-text)',
            marginBottom: '14px',
          }}
        >
          Give your secrets one place to live.
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--vk-text-secondary)',
            maxWidth: '520px',
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          Start with a free vault and move your first project out of scattered .env files,
          unencrypted wikis, and shared chat messages.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            className="btn btn-primary"
            style={{ padding: '12px 26px', fontSize: '0.92rem', fontWeight: 600 }}
          >
            Create your vault →
          </Link>
          <a
            href="#security"
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '0.92rem' }}
          >
            Read the architecture
          </a>
        </div>
      </div>
    </section>
  );
};
