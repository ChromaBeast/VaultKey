import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VaultKeyHeroVisual } from './VaultKeyHeroVisual';

export const HeroSection: React.FC = () => (
  <section id="hero" className="landing-hero section-shell">
    <div className="grid min-w-0 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="min-w-0 lg:col-span-6 flex flex-col items-start text-left">
        <h1 className="max-w-[560px] text-[2.65rem] sm:text-6xl lg:text-[4rem] font-extrabold tracking-[-0.035em] leading-[1.02] mb-6">
          Keep app secrets out of your files.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
          VaultKey stores passwords and API keys in an encrypted vault, then gives them to your app when it runs.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-12 px-6 rounded-lg font-semibold">
            <Link to="/signup">Get started free</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-12 px-6 rounded-lg border border-border font-semibold">
            <a href="#workflow">How it works</a>
          </Button>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-6 w-full flex justify-center lg:justify-end">
        <VaultKeyHeroVisual />
      </div>
    </div>
  </section>
);
