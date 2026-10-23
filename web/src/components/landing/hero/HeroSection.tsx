import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VaultKeyHeroVisual } from './VaultKeyHeroVisual';

export const HeroSection: React.FC = () => (
  <section id="hero" className="landing-hero section-shell">
    <div className="marketing-hero-grid">
      <div className="marketing-hero-copy">
        <h1>
          App secrets.<br />Outside your files.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
          Store API keys and passwords in an encrypted vault. Load them into your app at runtime.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-11 px-6 rounded-lg font-semibold">
            <Link to="/signup">Start free</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-11 px-6 rounded-lg border border-border font-semibold">
            <Link to="/how-it-works">How it works</Link>
          </Button>
        </div>
      </div>

      <div className="marketing-hero-product">
        <VaultKeyHeroVisual />
      </div>
    </div>
  </section>
);
