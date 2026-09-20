import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full max-w-[1200px] mx-auto px-6 pt-16 pb-12 border-t border-border mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <KeyRound size={16} color="var(--vk-accent)" />
            <span className="brand-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--vk-text)' }}>
              VaultKey
            </span>
          </div>
          <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem', lineHeight: 1.5, maxWidth: '260px' }}>
            Secrets in runtime memory. Never on disk.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--vk-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Product
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--vk-text-secondary)' }}>
            <li><Link to="/secrets">Secrets Vault</Link></li>
            <li><Link to="/keys">Machine Access Keys</Link></li>
            <li><Link to="/audit">Audit Ledger</Link></li>
            <li><a href="#pricing">Pricing & Tiers</a></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--vk-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Developers
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--vk-text-secondary)' }}>
            <li><Link to="/docs">CLI Setup</Link></li>
            <li><Link to="/docs">REST API Reference</Link></li>
            <li><a href="#workflow">Developer Workflows</a></li>
            <li><a href="https://github.com/ChromaBeast/VaultKey" target="_blank" rel="noreferrer">GitHub Repository</a></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--vk-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Legal
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem', color: 'var(--vk-text-secondary)' }}>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><a href="mailto:security@vaultkey.sheershjaiswal.in">Responsible Disclosure</a></li>
            <li><a href="mailto:sheersh@vaultkey.dev">Contact Support</a></li>
          </ul>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--vk-border)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--vk-text-muted)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <span>© {new Date().getFullYear()} VaultKey.</span>
      </div>
    </footer>
  );
};
