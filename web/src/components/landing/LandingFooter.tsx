import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => (
  <footer className="w-full border-t border-border bg-background">
    <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <img src="/vaultkey-logo.png" alt="" className="h-7 w-7 object-contain" />
            <span className="brand-text font-extrabold text-foreground">VaultKey</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">A safer home for the passwords and keys your app uses.</p>
        </div>

        <nav aria-label="Footer navigation" className="flex max-w-xl flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <a href="#workflow" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <a href="https://github.com/ChromaBeast/VaultKey" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="mailto:sheersh@vaultkey.dev" className="hover:text-foreground">Contact</a>
        </nav>
      </div>
      <p className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground">© {new Date().getFullYear()} VaultKey Systems</p>
    </div>
  </footer>
);
