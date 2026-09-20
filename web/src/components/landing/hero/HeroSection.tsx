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
    <section id="hero" className="section-shell pt-10 sm:pt-14 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Text & Actions */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Eyebrow / Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-primary bg-primary/10 border border-primary/25 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Zero Plaintext on Disk · v1.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
            Secrets in runtime<br className="hidden sm:inline" /> memory.{' '}
            <span className="text-primary">Never on disk.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            One binary. Secrets injected into RAM at runtime — never written to disk.
          </p>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap items-center mb-7">
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="group gap-2 font-semibold text-sm"
            >
              <span>Get Started</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/docs')}
              size="lg"
              className="gap-2 text-sm"
            >
              <BookOpen size={15} className="text-muted-foreground" />
              <span>Documentation</span>
            </Button>
          </div>

          {/* CLI install pill */}
          <button
            onClick={handleCopyInstall}
            title="Click to copy"
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all cursor-pointer shadow-sm"
          >
            <span className="text-primary font-bold">$</span>
            <span className="text-foreground">curl -fsSL vaultkey.dev/install.sh | sh</span>
            {copied
              ? <Check size={13} className="text-emerald-400 shrink-0" />
              : <Copy size={13} className="shrink-0 text-muted-foreground" />}
          </button>
        </div>

        {/* Right Column: Terminal Visual */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <VaultKeyHeroVisual />
        </div>
      </div>
    </section>
  );
};
