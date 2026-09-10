import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        background: scrolled ? 'rgba(8, 10, 15, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--vk-border)' : 'transparent'}`,
        transition: 'background var(--duration-fast) ease, border-color var(--duration-fast) ease',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, rgba(115, 230, 255, 0.2) 0%, rgba(139, 124, 255, 0.2) 100%)',
              border: '1px solid rgba(115, 230, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyRound size={14} color="var(--vk-accent)" />
          </div>
          <span className="brand-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--vk-text)' }}>
            VaultKey
          </span>
        </Link>

        {/* Center Nav */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#product" style={{ fontSize: '0.825rem', color: 'var(--vk-text-secondary)', fontWeight: 500 }}>
            Product
          </a>
          <a href="#security" style={{ fontSize: '0.825rem', color: 'var(--vk-text-secondary)', fontWeight: 500 }}>
            Security
          </a>
          <a href="#devex" style={{ fontSize: '0.825rem', color: 'var(--vk-text-secondary)', fontWeight: 500 }}>
            Developers
          </a>
          <a href="#pricing" style={{ fontSize: '0.825rem', color: 'var(--vk-text-secondary)', fontWeight: 500 }}>
            Pricing
          </a>
          <Link to="/docs" style={{ fontSize: '0.825rem', color: 'var(--vk-text-secondary)', fontWeight: 500 }}>
            Docs
          </Link>
        </nav>

        {/* Right Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/login"
            style={{ fontSize: '0.825rem', fontWeight: 500, color: 'var(--vk-text)', padding: '6px 12px' }}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '7px 14px' }}
          >
            Get started →
          </Link>
        </div>
      </div>
    </header>
  );
};
