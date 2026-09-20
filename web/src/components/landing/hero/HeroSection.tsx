import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Copy, Check } from 'lucide-react';
import { VaultKeyHeroVisual } from './VaultKeyHeroVisual';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    void navigator.clipboard.writeText('curl -fsSL https://vaultkey.dev/install.sh | sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="hero"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 64px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center' }}
        className="lg:grid-cols-[1fr_1fr]"
      >
        {/* Left: Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'var(--vk-surface-2)',
            border: '1px solid var(--vk-border)',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--vk-accent)',
            marginBottom: '24px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--vk-accent)' }} />
            Zero-knowledge · v1.0
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--vk-text)',
            margin: '0 0 20px',
          }}>
            Secrets in runtime<br />memory.{' '}
            <span style={{ color: 'var(--vk-accent)' }}>Never on disk.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--vk-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 0 32px',
          }}>
            Inject encrypted environment variables directly into process memory.
            No plaintext{' '}
            <code style={{
              fontSize: '0.8rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'var(--vk-surface-2)',
              border: '1px solid var(--vk-border)',
              fontFamily: 'var(--font-mono)',
            }}>.env</code>{' '}
            files. Zero cluster overhead.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              onClick={() => navigate('/signup')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--vk-accent)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Get Started <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/docs')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--vk-surface-2)',
                border: '1px solid var(--vk-border)',
                color: 'var(--vk-text)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <BookOpen size={15} style={{ color: 'var(--vk-text-muted)' }} />
              Documentation
            </button>
          </div>

          {/* CLI install pill */}
          <button
            onClick={handleCopyInstall}
            title="Click to copy"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--vk-surface-1)',
              border: '1px solid var(--vk-border)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--vk-text-muted)',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: 'var(--vk-accent)', fontWeight: 700 }}>$</span>
            <span style={{ color: 'var(--vk-text)' }}>curl -fsSL vaultkey.dev/install.sh | sh</span>
            {copied
              ? <Check size={13} style={{ color: 'var(--vk-success)', flexShrink: 0 }} />
              : <Copy size={13} style={{ flexShrink: 0 }} />}
          </button>
        </div>

        {/* Right: Terminal Visual */}
        <div style={{ width: '100%' }}>
          <VaultKeyHeroVisual />
        </div>
      </div>
    </section>
  );
};
