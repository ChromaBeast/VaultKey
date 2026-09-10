import React from 'react';
import { ArrowLeft, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthCardLayoutProps {
  title: string;
  subtitle?: string;
  error?: string;
  onBack?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
  title,
  subtitle,
  error,
  onBack,
  onClose,
  children,
  icon,
}) => {
  return (
    <div
      className="animate-fade"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'var(--vk-bg)',
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 32px',
          background: 'var(--vk-surface-1)',
          border: '1px solid var(--vk-border-strong)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--vk-shadow-pop)',
          position: 'relative',
        }}
      >
        {/* Top Navigation Row: Back and Close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            minHeight: '28px',
          }}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--vk-text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.15s ease',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--vk-text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.15s ease',
              }}
            >
              <span>Close</span>
              <X size={14} />
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                color: 'var(--vk-text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
              }}
            >
              <span>Close</span>
              <X size={14} />
            </Link>
          )}
        </div>

        {/* Optional Center Header Icon */}
        {icon && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            {icon}
          </div>
        )}

        {/* Heading & Subtitle */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--vk-text)',
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: 'var(--vk-text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'var(--vk-danger-dim)',
              border: '1px solid rgba(255, 107, 122, 0.3)',
              color: 'var(--vk-danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
