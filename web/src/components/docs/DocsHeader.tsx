import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Monitor } from 'lucide-react';
import type { User } from '../../lib/api';

interface DocsHeaderProps {
  onOpenSearch: () => void;
  user: User | null;
}

export const DocsHeader: React.FC<DocsHeaderProps> = ({
  onOpenSearch,
  user,
}) => {
  return (
    <header className="docs-header-root">
      <div className="docs-header-top">
        <div className="docs-header-container">
          {/* Left: Brand */}
          <div className="docs-header-left">
            <Link to="/" className="docs-brand-link" aria-label="VaultKey Docs Home">
              <img src="/vaultkey-logo.png" alt="VaultKey" className="docs-brand-logo" />
              <span className="docs-brand-name">
                VaultKey <span className="docs-brand-sub">Docs</span>
              </span>
            </Link>
          </div>

          {/* Center: Command Palette Trigger */}
          <div className="docs-header-center">
            <button
              type="button"
              className="docs-search-trigger"
              onClick={onOpenSearch}
              aria-label="Search documentation"
            >
              <Search size={14} className="docs-search-trigger-icon" />
              <span className="docs-search-trigger-text">Search documentation...</span>
              <kbd className="docs-search-trigger-kbd">⌘K</kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="docs-header-right">
            <a
              href="https://github.com/ChromaBeast/VaultKey"
              target="_blank"
              rel="noopener noreferrer"
              className="docs-icon-btn"
              title="GitHub Repository"
              aria-label="VaultKey on GitHub"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="docs-github-label">GitHub</span>
            </a>

            {user ? (
              <Link to="/secrets" className="docs-cta-btn">
                <span>Open App</span>
                <ArrowUpRight size={14} />
              </Link>
            ) : (
              <Link to="/signup" className="docs-cta-btn">
                <span>Try VaultKey</span>
                <ArrowUpRight size={14} />
              </Link>
            )}

            <div className="docs-theme-indicator" title="Dark Theme">
              <Monitor size={15} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
