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
    <section id="hero" className="relative section-shell pt-16 sm:pt-24 pb-24 sm:pb-32 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(0,143,245,0.18),transparent_70%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Text & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow / Release Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium text-primary bg-primary/10 border border-primary/25 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Zero Plaintext on Disk · v1.0</span>
          </div>

          {/* Headline — balanced 2-line typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground leading-[1.12] mb-6">
            Secrets in runtime memory.
            <span className="text-primary block mt-2">Never on disk.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
            One lightweight binary. Inject encrypted secrets directly into process RAM at runtime with zero plaintext on disk.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="group gap-2 font-semibold text-sm h-12 px-7 rounded-xl shadow-lg shadow-primary/25 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/docs')}
              size="lg"
              className="gap-2 text-sm h-12 px-6 rounded-xl border border-border cursor-pointer"
            >
              <BookOpen size={15} className="text-muted-foreground" />
              <span>Documentation</span>
            </Button>
          </div>

          {/* CLI install snippet */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono hidden sm:inline">Install:</span>
            <button
              onClick={handleCopyInstall}
              title="Click to copy"
              className="inline-flex items-center gap-3.5 px-4 py-2.5 rounded-xl bg-card border border-border text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all cursor-pointer shadow-sm group"
            >
              <span className="text-primary font-bold">$</span>
              <span className="text-foreground">curl -fsSL vaultkey.dev/install.sh | sh</span>
              {copied
                ? <Check size={14} className="text-emerald-400 shrink-0" />
                : <Copy size={14} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />}
            </button>
          </div>
        </div>

        {/* Right Column: Terminal Visual */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <VaultKeyHeroVisual />
        </div>
      </div>
    </section>
  );
};
