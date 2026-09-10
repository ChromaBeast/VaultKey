import React from 'react';
import { Link } from 'react-router-dom';

export const FinalCtaSection: React.FC = () => {
  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '120px auto',
        padding: '0 24px',
      }}
    >
      <div
        className="glass-glow"
        style={{
          padding: '64px 32px',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, rgba(14, 18, 27, 0.95) 0%, rgba(8, 10, 15, 0.98) 100%)',
          border: '1px solid rgba(94, 231, 255, 0.25)',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#f5f7fa',
            marginBottom: '16px',
          }}
        >
          Keep secrets out of your code today.
        </h2>
        <p
          style={{
            color: '#8b93a3',
            fontSize: '1rem',
            maxWidth: '540px',
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          Set up your first encrypted vault in less than 2 minutes. Free forever for solo developers
          and small projects.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            className="btn btn-cyan"
            style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            Get started free →
          </Link>
          <Link
            to="/docs"
            className="btn btn-secondary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            Read the Documentation
          </Link>
        </div>
      </div>
    </section>
  );
};
