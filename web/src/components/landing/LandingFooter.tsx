import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-[#06070a]">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14 text-left">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <img src="/vaultkey-mark.svg" alt="" className="h-4 w-4" />
              </div>
              <span className="brand-text text-base font-extrabold text-foreground">
                VaultKey
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              Secrets in runtime memory. Never on disk.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground list-none p-0 m-0">
              <li><Link to="/secrets" className="hover:text-foreground transition-colors">Secrets Vault</Link></li>
              <li><Link to="/keys" className="hover:text-foreground transition-colors">Machine Access Keys</Link></li>
              <li><Link to="/audit" className="hover:text-foreground transition-colors">Audit Ledger</Link></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing &amp; Plans</a></li>
            </ul>
          </div>

          {/* Dev Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground mb-4">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground list-none p-0 m-0">
              <li><Link to="/docs" className="hover:text-foreground transition-colors">CLI Setup Guide</Link></li>
              <li><Link to="/docs" className="hover:text-foreground transition-colors">REST API Reference</Link></li>
              <li><a href="#workflow" className="hover:text-foreground transition-colors">Dev Workflows</a></li>
              <li><a href="https://github.com/ChromaBeast/VaultKey" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub Repository</a></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground mb-4">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground list-none p-0 m-0">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><a href="mailto:security@vaultkey.sheershjaiswal.in" className="hover:text-foreground transition-colors">Responsible Disclosure</a></li>
              <li><a href="mailto:sheersh@vaultkey.dev" className="hover:text-foreground transition-colors">Contact Engineering</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-border/80 pt-6 flex flex-wrap justify-between items-center text-xs text-muted-foreground gap-4">
          <span>&copy; {new Date().getFullYear()} VaultKey Systems. Released under MIT license.</span>
          <span className="font-mono text-[11px] text-muted-foreground/70">AES-256-GCM &middot; RAM-Locked</span>
        </div>
      </div>
    </footer>
  );
};
