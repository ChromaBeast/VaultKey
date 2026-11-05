import React from 'react';
import { Link } from 'react-router-dom';

const COLUMNS: { title: string; links: { to?: string; href?: string; label: string }[] }[] = [
  { title: 'Product', links: [{ to: '/how-it-works', label: 'How it works' }, { to: '/security', label: 'Why VaultKey' }, { to: '/pricing', label: 'Pricing' }, { to: '/docs', label: 'Docs' }] },
  { title: 'Company', links: [{ to: '/contact', label: 'Contact' }, { href: 'https://github.com/ChromaBeast/VaultKey', label: 'GitHub' }] },
  { title: 'Legal', links: [{ to: '/terms', label: 'Terms' }, { to: '/privacy', label: 'Privacy' }, { to: '/refunds', label: 'Refunds' }] },
];

export const LandingFooter: React.FC = () => (
  <footer className="marketing-footer">
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)] pt-14 pb-8">
      <div className="marketing-footer-grid">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/vaultkey-logo.png" alt="" className="h-[30px] w-[30px] object-contain" />
            <span className="brand-text text-lg font-extrabold text-foreground">VaultKey</span>
          </div>
          <p className="mt-3.5 max-w-xs text-sm leading-relaxed text-muted-foreground">An encrypted vault for your app secrets. Load them at runtime, without files or leaks.</p>
        </div>
        <nav aria-label="Footer navigation" className="marketing-footer-cols">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? <Link to={l.to}>{l.label}</Link> : <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="marketing-footer-bottom">
        <p>© {new Date().getFullYear()} VaultKey Systems. All rights reserved.</p>
        <p className="status"><span aria-hidden="true" />All systems operational</p>
      </div>
    </div>
  </footer>
);
