import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ background: '#0b0e14', minHeight: '100vh', color: '#f8fafc', overflowX: 'hidden' }}>
      {/* Navigation Bar */}
      <header
        className="glass"
        style={{
          position: 'sticky',
          top: '16px',
          maxWidth: '1200px',
          margin: '16px auto 0',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            🗝️
          </div>
          <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            VaultKey
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Features</a>
          <a href="#security" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Security</a>
          <Link to="/docs" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Docs</Link>
          <Link to="/billing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Pricing</Link>
        </nav>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/signup" className="btn btn-primary">Start Free →</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="animate-fade" style={{ maxWidth: '1200px', margin: '80px auto 60px', padding: '0 24px', textAlign: 'center' }}>
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
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '0.75rem' }}>✨</span> Introducing VaultKey 2.0 & Go 1.26.5 SDK
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            maxWidth: '900px',
            margin: '0 auto 20px',
            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          End-to-End Encrypted Secrets for Engineering Teams
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Centralize API keys, production credentials, and environment variables with zero-knowledge Argon2id RAM derivation and tamper-evident audit chains.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Get Started Free →
          </Link>
          <Link to="/docs" className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '1rem' }}>
            Read Architecture Docs
          </Link>
        </div>

        {/* Hero Product Preview Card */}
        <div className="glass-glow" style={{ padding: '24px', borderRadius: '20px', textAlign: 'left', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <span className="code-font" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>vaultkey run -- env production</span>
          </div>

          <pre className="code-font" style={{ fontSize: '0.875rem', color: '#34d399', margin: 0, overflowX: 'auto', lineHeight: 1.7 }}>
            <code>{`$ vaultkey run -- npm start
[vaultkey] Unlocking Zero-Knowledge Vault (org: acme-corp)...
[vaultkey] Deriving master key via Argon2id (memory: 64MB, threads: 4)...
[vaultkey] Decrypted 14 secrets into process RAM environment.
[vaultkey] Injecting DB_POSTGRES_URL, STRIPE_SECRET_KEY, AWS_ACCESS_KEY...
✓ Server running on https://api.acme.internal:8080`}</code>
          </pre>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{ maxWidth: '1200px', margin: '100px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Built for Zero-Trust Engineering
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '8px' }}>
            Everything your team needs to eliminate leaked environment keys and plain-text configuration.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔐</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Argon2id + AES-256-GCM</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Master keys are derived in RAM only. Plaintext secrets never hit disk or unencrypted database tables.
            </p>
          </div>

          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Scoped API Access Tokens</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Generate granular read/write tokens for GitHub Actions, Kubernetes pods, and CI/CD deployment jobs.
            </p>
          </div>

          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>HMAC Audit Ledger</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every access event, secret reveal, and configuration change is cryptographically hashed for audit verification.
            </p>
          </div>

          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔥</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>1-Time Self-Destruct Links</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Share sensitive credentials with teammates via ephemeral links that auto-erase after 1 view.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
        <p>© {new Date().getFullYear()} VaultKey Inc. Built with Go 1.26.5 & React Router v7.</p>
      </footer>
    </div>
  );
};
