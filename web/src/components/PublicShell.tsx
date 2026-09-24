import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="docs-shell">
      <a className="docs-skip-link" href="#docs-main">Skip to content</a>
      <header className="docs-site-header">
        <div className="docs-site-header-inner">
          <div className="docs-brand-group">
            <Link to="/" className="docs-brand" aria-label="VaultKey home">
              <img src="/vaultkey-logo.png" alt="" />
              <span className="brand-text">VaultKey</span>
            </Link>
            <span className="docs-brand-separator" aria-hidden="true" />
            <span className="docs-brand-current">Docs</span>
          </div>

          <nav className="docs-header-actions" aria-label="Account">
            {user ? (
              <Link to="/secrets" className="btn btn-secondary docs-header-cta">
                Open app <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="docs-header-link">Sign in</Link>
                <Link to="/signup" className="btn btn-primary docs-header-cta">
                  Start free <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main id="docs-main">{children}</main>
    </div>
  );
};
