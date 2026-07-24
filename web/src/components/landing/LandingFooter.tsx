import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px', background: '#090c14' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🗝️</span>
          <span className="brand-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>VaultKey</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© {new Date().getFullYear()} VaultKey Inc.</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: '#94a3b8' }}>
          <Link to="/docs" style={{ color: '#94a3b8', textDecoration: 'none' }}>Documentation</Link>
          <Link to="/billing" style={{ color: '#94a3b8', textDecoration: 'none' }}>Pricing</Link>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sign In</Link>
          <span className="code-font" style={{ color: '#818cf8' }}>v2.0.0 (Go 1.26.5)</span>
        </div>
      </div>
    </footer>
  );
};
