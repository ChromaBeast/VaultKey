import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ChevronDown,
  Monitor,
  ArrowUpRight,
} from 'lucide-react';
import { DOC_TABS } from './docsData';
import type { User } from '../../lib/api';

interface DocsHeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenSearch: () => void;
  onOpenAskAi: () => void;
  user: User | null;
}

export const DocsHeader: React.FC<DocsHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenAskAi,
  user,
}) => {
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('v1.4 (Latest)');

  return (
    <header className="docs-header-root">
      {/* Top Navbar */}
      <div className="docs-header-top">
        <div className="docs-header-container">
          {/* Left: Brand + Context switcher */}
          <div className="docs-header-left">
            <Link to="/" className="docs-brand-link" aria-label="VaultKey Docs Home">
              <img src="/vaultkey-logo.png" alt="VaultKey" className="docs-brand-logo" />
              <span className="docs-brand-name">VaultKey <span className="docs-brand-sub">Docs</span></span>
            </Link>

            <div className="docs-version-wrapper">
              <button
                type="button"
                className="docs-version-badge"
                onClick={() => setVersionMenuOpen((prev) => !prev)}
                aria-expanded={versionMenuOpen}
                aria-haspopup="true"
              >
                <span>{selectedVersion}</span>
                <ChevronDown size={12} className={`docs-chevron ${versionMenuOpen ? 'is-open' : ''}`} />
              </button>

              {versionMenuOpen && (
                <div className="docs-version-menu" role="menu">
                  {['v1.4 (Latest)', 'v1.3 (Stable)', 'v2.0 (Preview)'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`docs-version-menu-item ${selectedVersion === v ? 'is-active' : ''}`}
                      role="menuitem"
                      onClick={() => {
                        setSelectedVersion(v);
                        setVersionMenuOpen(false);
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            <button
              type="button"
              className="docs-ask-ai-btn"
              onClick={onOpenAskAi}
              aria-label="Ask VaultKey AI"
            >
              <Sparkles size={14} className="text-sky-400" />
              <span>Ask AI</span>
            </button>

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

            <div className="docs-theme-indicator" title="System Dark Theme">
              <Monitor size={15} />
            </div>
          </div>
        </div>
      </div>

      {/* Subnav Tabs Bar */}
      <div className="docs-subnav-bar">
        <div className="docs-subnav-container">
          <nav className="docs-subnav-tabs" aria-label="Documentation Categories">
            {DOC_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`docs-subnav-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{tab.label}</span>
                  {tab.badge && <span className="docs-subnav-badge">{tab.badge}</span>}
                  {isActive && <span className="docs-subnav-active-bar" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
