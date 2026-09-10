import React from 'react';
import { KeyRound, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthHeroVisual } from './AuthHeroVisual';

interface AuthSplitLayoutProps {
  title: string;
  subtitle: string;
  error?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  title,
  subtitle,
  error,
  children,
  footer,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--vk-bg)',
        color: 'var(--vk-text)',
      }}
    >
      {/* Left Form Pane */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Brand Header */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              marginBottom: '36px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, rgba(115, 230, 255, 0.25) 0%, rgba(139, 124, 255, 0.25) 100%)',
                border: '1px solid rgba(115, 230, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={20} color="var(--vk-accent)" />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                VaultKey
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--vk-accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Zero-Trust Engine
              </span>
            </div>
          </Link>

          {/* Heading */}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--vk-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '28px' }}>
            {subtitle}
          </p>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: 'var(--vk-danger-dim)',
                border: '1px solid rgba(255, 107, 122, 0.3)',
                color: 'var(--vk-danger)',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content */}
          {children}

          {/* Optional Footer Link */}
          {footer && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '28px',
                paddingTop: '22px',
                borderTop: '1px solid var(--vk-border)',
                fontSize: '0.825rem',
                color: 'var(--vk-text-muted)',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Right Hero Showcase Pane (Hidden on narrow screens via CSS) */}
      <div
        className="auth-hero-pane"
        style={{
          flex: '1 1 50%',
          display: 'flex',
        }}
      >
        <AuthHeroVisual />
      </div>
    </div>
  );
};
