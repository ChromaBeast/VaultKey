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

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({ title, subtitle, error, onBack, onClose, children, icon }) => (
  <div className="animate-fade vk-glow auth-card-page">
    <div className="glass auth-card">
      <Link to="/" className="auth-card-brand" aria-label="VaultKey home">
        <img src="/vaultkey-logo.png" alt="" />
        <span>VaultKey</span>
      </Link>

      <div className="auth-card-nav">
        {onBack ? (
          <button type="button" onClick={onBack} className="auth-card-link">
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {onClose ? (
          <button type="button" onClick={onClose} className="auth-card-link is-muted">
            <span>Close</span>
            <X size={14} />
          </button>
        ) : (
          <Link to="/login" className="auth-card-link is-muted">
            <span>Close</span>
            <X size={14} />
          </Link>
        )}
      </div>

      {icon && <div className="auth-card-icon">{icon}</div>}

      <div className="auth-card-heading">
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      </div>

      {error && (
        <div role="alert" className="auth-error">
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}

      {children}
    </div>
  </div>
);
