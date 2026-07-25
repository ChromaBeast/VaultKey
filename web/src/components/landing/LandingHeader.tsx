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
          background: 'rgba(18, 24, 36, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
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
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 246, 0.4)',
              fontSize: '15px',
            }}
          >
            🗝️
          </div>
          <span
            className="brand-text"
            style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em' }}
          >
            VaultKey
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[
            { href: '#features', label: 'Features' },
            { href: '#architecture', label: 'Architecture' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.15s ease' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/docs"
            style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}
          >
            Docs
          </Link>
          <Link
            to="/billing"
            style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}
          >
            Pricing
          </Link>
        </nav>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '7px 14px' }}>
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '7px 14px' }}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};
