import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthHeroVisual } from './AuthHeroVisual';

interface AuthSplitLayoutProps {
  title: string;
  subtitle: string;
  error?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({ title, subtitle, error, children, footer }) => (
  <div className="auth-shell auth-split">
    <div className="auth-form-pane auth-split-form">
      <div className="auth-split-inner">
        <Link to="/" className="auth-split-brand">
          <img src="/vaultkey-logo.png" alt="" width="34" height="34" />
          <span className="brand-text">VaultKey</span>
        </Link>

        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        {error && (
          <div role="alert" className="auth-error">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        {children}

        {footer && <div className="auth-split-footer">{footer}</div>}
      </div>
    </div>

    {/* Hero pane is hidden on narrow screens via responsive.css */}
    <div className="auth-hero-pane auth-split-hero">
      <AuthHeroVisual />
    </div>
  </div>
);
