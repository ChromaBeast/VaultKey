import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Copy, Check } from 'lucide-react';
import { VaultKeyHeroVisual } from './VaultKeyHeroVisual';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('curl -fsSL https://vaultkey.dev/install.sh | sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="hero"
      className="w-full max-w-[1200px] mx-auto px-6 pt-16 pb-12 box-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Headline, Subtitle, Actions, CLI Quick-install */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--vk-surface-2)] border border-[var(--vk-border)] text-xs font-mono text-[var(--vk-accent)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vk-accent)] animate-pulse" />
            <span>Zero Plaintext on Disk · v1.0</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[var(--vk-text)] leading-[1.1] mb-5">
            Secrets in runtime memory.{' '}
            <span className="text-[var(--vk-accent)] block">Never on disk.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[var(--vk-text-secondary)] max-w-xl leading-relaxed mb-8">
            Inject encrypted environment variables directly into process memory via a single lightweight binary. No plaintext <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--vk-surface-2)] border border-[var(--vk-border)] font-mono text-[var(--vk-text)]">.env</code> files, zero cluster overhead.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-3.5 mb-6">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--vk-accent)] text-white text-sm font-semibold hover:bg-[var(--vk-accent-hover)] transition-all cursor-pointer shadow-sm group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[var(--radius-md)] bg-[var(--vk-surface-2)] border border-[var(--vk-border)] text-[var(--vk-text)] text-sm font-medium hover:bg-[var(--vk-surface-3)] hover:border-[var(--vk-border-hover)] transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[var(--vk-text-muted)]" />
              <span>Documentation</span>
            </button>
          </div>

          {/* Quick CLI Install Command */}
          <div
            onClick={handleCopyInstall}
            className="inline-flex items-center gap-3 px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--vk-surface-1)] border border-[var(--vk-border)] text-xs font-mono text-[var(--vk-text-muted)] hover:border-[var(--vk-border-hover)] transition-colors cursor-pointer select-none"
            title="Click to copy install command"
          >
            <span className="text-[var(--vk-accent)] select-none font-bold">$</span>
            <span className="text-[var(--vk-text)]">curl -fsSL vaultkey.dev/install.sh | sh</span>
            <span className="text-[var(--vk-text-muted)] hover:text-[var(--vk-text)] transition-colors ml-1 p-0.5">
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--vk-success)]" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </div>
        </div>

        {/* Right Column: Expansive Authentic Terminal Visual */}
        <div className="lg:col-span-6 xl:col-span-5 w-full flex justify-center lg:justify-end">
          <VaultKeyHeroVisual />
        </div>
      </div>
    </section>
  );
};
