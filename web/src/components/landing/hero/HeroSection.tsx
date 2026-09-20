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
    <section id="hero" className="w-full max-w-[1200px] mx-auto px-6 pt-16 sm:pt-20 pb-12 box-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left Column: Text & Actions */}
        <div className="flex flex-col items-start text-left max-w-xl">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-foreground leading-[1.12] mb-5">
            Secrets in runtime<br className="hidden sm:inline" /> memory.{' '}
            <span className="text-primary">Never on disk.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            One binary. Secrets injected into RAM at runtime — never written to disk.
          </p>

          {/* Actions */}
          <div className="flex gap-3.5 flex-wrap items-center mb-6">
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="gap-2 font-semibold h-11 px-6 text-sm"
            >
              Get Started <ArrowRight size={15} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/docs')}
              size="lg"
              className="gap-2 h-11 px-5 text-sm"
            >
              <BookOpen size={15} className="text-muted-foreground" />
              Documentation
            </Button>
          </div>

          {/* CLI install pill */}
          <button
            onClick={handleCopyInstall}
            title="Click to copy"
            className="inline-flex items-center gap-3 px-3.5 py-2 rounded-lg bg-card border border-border text-xs font-mono text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer"
          >
            <span className="text-primary font-bold">$</span>
            <span className="text-foreground">curl -fsSL vaultkey.dev/install.sh | sh</span>
            {copied
              ? <Check size={13} className="text-emerald-400 shrink-0" />
              : <Copy size={13} className="shrink-0" />}
          </button>
        </div>

        {/* Right Column: Terminal Visual */}
        <div className="w-full flex justify-center lg:justify-end">
          <VaultKeyHeroVisual />
        </div>
      </div>
    </section>
  );
};
