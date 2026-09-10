import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        padding: '40px 24px',
        background: '#080a0f',
        marginTop: '0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #141a26 0%, #1a2233 100%)',
                border: '1px solid rgba(94, 231, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              🗝️
            </div>
            <span className="brand-text" style={{ fontSize: '1rem', fontWeight: 800, color: '#f5f7fa' }}>
              VaultKey
            </span>
          </div>
          <span
            className="code-font"
            style={{
              fontSize: '0.72rem',
              color: '#8b93a3',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              paddingLeft: '16px',
            }}
          >
            © {new Date().getFullYear()} VaultKey Inc. Built for engineering teams.
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { to: '#product', label: 'Product' },
            { to: '#security', label: 'Security' },
            { to: '#developers', label: 'Developers' },
            { to: '#pricing', label: 'Pricing' },
            { to: '/docs', label: 'Docs' },
            { to: '/login', label: 'Sign In' },
          ].map((link) =>
            link.to.startsWith('#') ? (
              <a
                key={link.to}
                href={link.to}
                style={{ color: '#8b93a3', fontSize: '0.825rem', fontWeight: 500 }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#f5f7fa')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#8b93a3')}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                style={{ color: '#8b93a3', fontSize: '0.825rem', fontWeight: 500 }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#f5f7fa')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#8b93a3')}
              >
                {link.label}
              </Link>
            )
          )}
          <span
            className="code-font"
            style={{
              fontSize: '0.68rem',
              color: '#5ee7ff',
              background: 'rgba(94, 231, 255, 0.08)',
              border: '1px solid rgba(94, 231, 255, 0.2)',
              padding: '3px 9px',
              borderRadius: '5px',
              letterSpacing: '0.04em',
            }}
          >
            Zero-Disk Architecture
          </span>
        </nav>
      </div>
    </footer>
  );
};
