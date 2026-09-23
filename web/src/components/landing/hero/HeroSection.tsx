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
    <section id="hero" className="landing-hero relative section-shell overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(0,143,245,0.18),transparent_70%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Text & Actions */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Headline — balanced 2-line typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight text-foreground leading-[1.02] mb-5">
            Keep secrets out of your files.
            <span className="text-primary block mt-1">Run them from memory.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            VaultKey stores secrets encrypted and delivers decrypted values to your app in memory when needed.
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
              <span>Read the docs</span>
            </Button>
          </div>

          {/* CLI install snippet */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono hidden sm:inline">Try it</span>
            <button
              onClick={handleCopyInstall}
              title="Click to copy"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all cursor-pointer group max-w-full"
            >
            <span className="text-primary font-bold">$</span>
              <span className="text-foreground truncate">curl -fsSL https://vaultkey.dev/install.sh | sh</span>
              {copied
                ? <Check size={14} className="text-emerald-400 shrink-0" />
                : <Copy size={14} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />}
            </button>
          </div>
        </div>

        {/* Right Column: Terminal Visual */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <VaultKeyHeroVisual />
        </div>
      </div>
    </section>
  );
};
