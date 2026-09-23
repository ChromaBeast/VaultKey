import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const LandingHeader: React.FC = () => (
  <header className="sticky top-0 z-50 h-16 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
    <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="VaultKey home">
        <img src="/vaultkey-logo.png" alt="" className="h-8 w-8 object-contain" />
        <span className="brand-text text-lg font-extrabold tracking-tight text-foreground">VaultKey</span>
      </Link>

      <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
        <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
        <a href="#comparison" className="text-sm text-muted-foreground hover:text-foreground">Why VaultKey</a>
        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
        <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground">Docs</Link>
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link to="/login" className="inline-flex px-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:px-2">Sign in</Link>
        <Button asChild size="sm" className="rounded-lg px-3 sm:px-4">
          <Link to="/signup">Start free</Link>
        </Button>
      </div>
    </div>
  </header>
);
