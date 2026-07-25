import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '36px 24px',
        background: '#090c14',
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
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              🗝️
            </div>
            <span className="brand-text" style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
              VaultKey
            </span>
          </div>
          <span
            className="code-font"
            style={{ fontSize: '0.7rem', color: '#334155', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '16px' }}
          >
            © {new Date().getFullYear()} VaultKey Inc.
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { to: '/docs', label: 'Docs' },
            { to: '/billing', label: 'Pricing' },
            { to: '/login', label: 'Sign In' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.15s ease' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#94a3b8')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              {link.label}
            </Link>
          ))}
          <span
            className="code-font"
            style={{
              fontSize: '0.7rem',
              color: '#6366f1',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              padding: '3px 8px',
              borderRadius: '5px',
            }}
          >
            v2.0 · Go 1.26.5
          </span>
        </nav>
      </div>
    </footer>
  );
};
