import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            maxWidth: '440px',
            margin: '0 0 32px',
          }}>
            One binary. Secrets injected into RAM at runtime — never written to disk.
          </p>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap mb-6">
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="gap-2 font-semibold"
            >
              Get Started <ArrowRight size={15} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/docs')}
              size="lg"
              className="gap-2"
            >
              <BookOpen size={15} className="text-muted-foreground" />
              Documentation
            </Button>
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
