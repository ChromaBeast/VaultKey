import React from 'react';
import { Link } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  return (
    <header
      className="glass"
      style={{
        position: 'sticky',
        top: '16px',
        maxWidth: '1200px',
        margin: '16px auto 0',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        borderRadius: '14px',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          🗝️
        </div>
        <span className="brand-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em' }}>
          VaultKey
        </span>
      </Link>

      <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Features</a>
        <a href="#architecture" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Architecture</a>
        <Link to="/docs" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Docs</Link>
        <Link to="/billing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Pricing</Link>
      </nav>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Sign In</Link>
        <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>Get Started →</Link>
      </div>
    </header>
  );
};
