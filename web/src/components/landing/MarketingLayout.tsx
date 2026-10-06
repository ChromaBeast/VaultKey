import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LandingHeader } from './LandingHeader';
import { LandingFooter } from './LandingFooter';
const PAGE_TITLES: Record<string, string> = {
  '/': 'VaultKey | App secrets, outside your files',
  '/how-it-works': 'How it works | VaultKey',
  '/security': 'Why VaultKey | Security and access',
  '/pricing': 'Pricing | VaultKey',
};
const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/': 'Store API keys and passwords in an encrypted vault. Load them into your app at runtime.',
  '/how-it-works': 'Connect your applications to VaultKey with the CLI, SDKs, or REST API.',
  '/security': 'Understand VaultKey encryption, scoped access, key lifecycle, and the audit ledger.',
  '/pricing': 'Compare VaultKey Free, Team, and Enterprise plans for your projects and workspace.',
};
export function MarketingLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = PAGE_TITLES[pathname] || 'VaultKey';
    const metadata = [
      ['meta[name="description"]', PAGE_DESCRIPTIONS[pathname]],
      ['meta[property="og:title"]', PAGE_TITLES[pathname]],
      ['meta[property="og:description"]', PAGE_DESCRIPTIONS[pathname]],
      ['meta[name="twitter:title"]', PAGE_TITLES[pathname]],
      ['meta[name="twitter:description"]', PAGE_DESCRIPTIONS[pathname]],
    ];
    metadata.forEach(([selector, content]) => {
      if (content) document.querySelector(selector)?.setAttribute('content', content);
    });
    const frame = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <div className="landing-page marketing-shell">
    <a className="docs-skip-link" href="#marketing-main">Skip to content</a>
    <LandingHeader />
    <main id="marketing-main" tabIndex={-1}><Outlet /></main>
    <LandingFooter />
  </div>;
}
