import React from 'react';
import { Link } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  return (
    <header
      style={{
        position: 'sticky',
        top: '12px',
        maxWidth: '1200px',
        margin: '12px auto 0',
        padding: '0 16px',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: 'rgba(14, 18, 27, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #141a26 0%, #1a2233 100%)',
              border: '1px solid rgba(94, 231, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              fontSize: '15px',
            }}
          >
            🗝️
          </div>
          <span
            className="brand-text"
            style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f5f7fa', letterSpacing: '-0.025em' }}
          >
            VaultKey
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { href: '#product', label: 'Product' },
            { href: '#security', label: 'Security' },
            { href: '#developers', label: 'Developers' },
            { href: '#pricing', label: 'Pricing' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                color: '#8b93a3',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'color 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#f5f7fa')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#8b93a3')}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/docs"
            style={{ color: '#8b93a3', fontSize: '0.875rem', fontWeight: 500 }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#f5f7fa')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#8b93a3')}
          >
            Docs
          </Link>
        </nav>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            to="/login"
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '7px 14px' }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="btn btn-cyan"
            style={{ fontSize: '0.85rem', padding: '7px 16px' }}
          >
            Get Started →
          </Link>
        </div>
      </div>
    </header>
  );
};
