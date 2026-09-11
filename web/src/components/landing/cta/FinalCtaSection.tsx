import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const FinalCtaSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const installCmd = 'curl -sSL https://vaultkey.sh/install | sh';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ maxWidth: '1200px', margin: '100px auto 0', padding: '0 24px' }}>
      <div
        className="glass"
        style={{
          padding: '56px 32px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(14, 18, 27, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--vk-text)',
            marginBottom: '12px',
          }}
        >
          Stop committing secrets to disk.
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--vk-text-muted)',
            maxWidth: '540px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Install the CLI on your workstation or server in seconds. Zero telemetry, zero external dependencies.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(5, 7, 12, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--vk-text-secondary)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'var(--vk-accent)', fontWeight: 700 }}>$</span>
          <span>{installCmd}</span>
          <button
            type="button"
            aria-label="Copy install command to clipboard"
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? 'var(--vk-success)' : 'var(--vk-text-muted)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              marginLeft: '8px',
              fontWeight: 600,
            }}
          >
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            Create Vault
          </Link>
          <a
            href="https://github.com/ChromaBeast/VaultKey"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            GitHub Repository
          </a>
          <Link
            to="/docs"
            className="btn btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Documentation
          </Link>
        </div>
      </div>
    </section>
  );
};
