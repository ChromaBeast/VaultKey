import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--vk-border)',
        padding: '64px 24px 40px',
        maxWidth: '1200px',
        margin: '80px auto 0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '56px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <KeyRound size={16} color="var(--vk-accent)" />
            <span className="brand-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--vk-text)' }}>
              VaultKey
            </span>
          </div>
          <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem', lineHeight: 1.6, maxWidth: '280px' }}>
            Secure secrets for modern engineering teams. Keep credentials out of code with zero-trust encryption.
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
            <li><a href="#architecture">Cryptographic Architecture</a></li>
            <li><a href="https://github.com/ChromaBeast/VaultKey" target="_blank" rel="noreferrer">GitHub Repository</a></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--vk-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Governance
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
        <span>© {new Date().getFullYear()} VaultKey. All rights reserved.</span>
        <span>Engineered for zero-knowledge security.</span>
      </div>
    </footer>
  );
};
