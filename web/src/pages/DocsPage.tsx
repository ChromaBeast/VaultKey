import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DocsHeader } from '../components/docs/DocsHeader';
import { VAULTKEY_DOCS_MARKDOWN, type SearchDocItem } from '../components/docs/docsData';
import { DocsLeftNav } from '../components/docs/DocsLeftNav';
import { DocsSearchModal } from '../components/docs/DocsSearchModal';
import { DocsCopyPageButton } from '../components/docs/DocsCopyPageButton';
import { QuickstartDocSection } from '../components/docs/QuickstartDocSection';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { McpDocSection } from '../components/docs/McpDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
import { copyText } from '../hooks/useClipboard';

const SECTION_IDS = ['quickstart', 'cli', 'sdk', 'mcp', 'api', 'security'];

export const DocsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState<string>(() => {
    const hash = window.location.hash.slice(1);
    if (hash && SECTION_IDS.includes(hash)) return hash;
    return 'quickstart';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = 'VaultKey Developer Documentation';
  }, []);

  // Handle URL hash changes
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(hash);
      }
    };

    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // IntersectionObserver to highlight current active section in vertical nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-60px 0px -60% 0px', threshold: 0.1 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Global shortcut: ⌘K or Ctrl+K to open search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleCopy = (id: string, code: string) => {
    void copyText(code).then((ok) => {
      if (!ok) return;
      setCopiedSnippet(id);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopiedSnippet(null), 2000);
    });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${sectionId}`);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSelect = (item: SearchDocItem) => {
    scrollToSection(item.id || item.sectionId);
  };

  return (
    <div className="docs-page-root">
      {/* Top Header */}
      <DocsHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        user={user}
      />

      {/* 2-Column Documentation Body: Vertical Nav + Main Content */}
      <div className="docs-body-wrapper">
        <div className="docs-body-container">
          {/* Left Column: Vertical Navigation Sidebar */}
          <DocsLeftNav
            activeSection={activeSection}
            onSelectItem={scrollToSection}
          />

          {/* Center Column: Main Content */}
          <main className="docs-main-article" tabIndex={-1}>
            {/* Article Top Title & Copy Button */}
            <div className="docs-article-header">
              <div className="docs-article-header-left">
                <div className="docs-eyebrow-tag">Documentation</div>
                <h1 className="docs-article-title">VaultKey Developer Docs</h1>
                <p className="docs-lead-text text-muted-foreground mt-1">
                  Store secrets once, give them to apps and AI agents at runtime.
                </p>
              </div>

              <div className="docs-article-header-right">
                <DocsCopyPageButton
                  pageTitle="VaultKey Developer Documentation"
                  markdownContent={VAULTKEY_DOCS_MARKDOWN}
                />
              </div>
            </div>

            {/* Content Sections */}
            <div className="docs-article-content space-y-16">
              <QuickstartDocSection
                onCopy={handleCopy}
                copiedSnippet={copiedSnippet}
                onNavigateNext={() => scrollToSection('cli')}
              />

              <CliDocSection
                onCopy={handleCopy}
                copiedSnippet={copiedSnippet}
                onNavigateNext={() => scrollToSection('sdk')}
              />

              <SdkDocSection
                onCopy={handleCopy}
                copiedSnippet={copiedSnippet}
                onNavigateNext={() => scrollToSection('mcp')}
              />

              <McpDocSection
                onCopy={handleCopy}
                copiedSnippet={copiedSnippet}
                onNavigateNext={() => scrollToSection('api')}
              />

              <ApiDocSection
                onCopy={handleCopy}
                copiedSnippet={copiedSnippet}
                onNavigateNext={() => scrollToSection('security')}
              />

              <SecurityDocSection
                onCopy={handleCopy}
                copiedSnippet={copiedSnippet}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Command Palette Modal */}
      <DocsSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </div>
  );
};
