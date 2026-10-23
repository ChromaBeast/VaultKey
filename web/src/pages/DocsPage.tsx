import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DocsHeader } from '../components/docs/DocsHeader';
import { DOC_TABS, type SearchDocItem } from '../components/docs/docsData';
import { DocsLeftNav } from '../components/docs/DocsLeftNav';
import { DocsRightToc, type TocHeading } from '../components/docs/DocsRightToc';
import { DocsSearchModal } from '../components/docs/DocsSearchModal';
import { DocsAskAiModal } from '../components/docs/DocsAskAiModal';
import { DocsCopyPageButton } from '../components/docs/DocsCopyPageButton';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { McpDocSection } from '../components/docs/McpDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
import { copyText } from '../hooks/useClipboard';

const TOC_MAP: Record<string, TocHeading[]> = {
  cli: [
    { id: 'cli-overview', title: 'Summary', level: 2 },
    { id: 'cli-when', title: 'When to use this', level: 2 },
    { id: 'cli-auth', title: 'Authentication', level: 2 },
    { id: 'cli-steps', title: 'Steps & workflow', level: 2 },
    { id: 'cli-verify', title: 'Verify', level: 2 },
    { id: 'cli-ref', title: 'Command reference', level: 2 },
  ],
  sdk: [
    { id: 'sdk-overview', title: 'Summary', level: 2 },
    { id: 'sdk-when', title: 'When to use this', level: 2 },
    { id: 'sdk-prereq', title: 'Prerequisites', level: 2 },
    { id: 'sdk-node', title: 'Node.js / TypeScript', level: 2 },
    { id: 'sdk-python', title: 'Python', level: 2 },
    { id: 'sdk-verify', title: 'Verify', level: 2 },
    { id: 'sdk-ref', title: 'SDK reference', level: 2 },
  ],
  mcp: [
    { id: 'mcp-overview', title: 'Summary', level: 2 },
    { id: 'mcp-when', title: 'When to use this', level: 2 },
    { id: 'mcp-why', title: 'Why run_with_secrets', level: 2 },
    { id: 'mcp-steps', title: 'Configuration steps', level: 2 },
    { id: 'mcp-verify', title: 'Verify', level: 2 },
    { id: 'mcp-tools', title: 'Reference: Available tools', level: 2 },
  ],
  api: [
    { id: 'api-overview', title: 'Summary', level: 2 },
    { id: 'api-when', title: 'When to use this', level: 2 },
    { id: 'api-auth', title: 'Authentication', level: 2 },
    { id: 'api-endpoints', title: 'Reference: REST endpoints', level: 2 },
    { id: 'api-verify', title: 'Verify with cURL', level: 2 },
  ],
  security: [
    { id: 'security-overview', title: 'Summary', level: 2 },
    { id: 'security-when', title: 'When to use this', level: 2 },
    { id: 'sec-kdf', title: '1. Key derivation (Argon2id)', level: 2 },
    { id: 'sec-ram', title: '2. Master key in memory zeroing', level: 2 },
    { id: 'sec-gcm', title: '3. AES-256-GCM encryption', level: 2 },
    { id: 'sec-audit', title: '4. HMAC-SHA256 audit ledger', level: 2 },
    { id: 'sec-rbac', title: '5. Role-based access control', level: 2 },
  ],
};

const TAB_METADATA: Record<string, { eyebrow: string; title: string; desc: string }> = {
  cli: {
    eyebrow: 'Guide 1',
    title: 'CLI tooling',
    desc: 'Authenticate, sync local variables, and inject secrets into a child process.',
  },
  sdk: {
    eyebrow: 'Guide 2',
    title: 'SDKs',
    desc: 'Read secrets from Node.js and Python services at runtime.',
  },
  mcp: {
    eyebrow: 'Guide 3',
    title: 'MCP / AI agents',
    desc: 'Give AI coding agents (Claude Code, Cursor, Antigravity) structured access to your secrets—without leaking values into the LLM context window.',
  },
  api: {
    eyebrow: 'Guide 4',
    title: 'REST API',
    desc: 'Core endpoints for authentication, encrypted values, and one-time sharing.',
  },
  security: {
    eyebrow: 'Guide 5',
    title: 'Security model',
    desc: 'How VaultKey derives keys, encrypts values in memory, and verifies the tamper-evident audit chain.',
  },
};

export const DocsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.slice(1);
    if (hash && (TOC_MAP[hash] || hash in TAB_METADATA)) return hash;
    return 'cli'; // Order: 1. CLI tooling, 2. SDKs, 3. MCP, 4. REST API, 5. Security model
  });

  const [activeNavId, setActiveNavId] = useState<string>('cli-overview');
  const [activeTocId, setActiveTocId] = useState<string>('cli-overview');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = `${TAB_METADATA[activeTab]?.title || 'Developer Docs'} | VaultKey`;
  }, [activeTab]);

  // Handle URL hash changes
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      if (DOC_TABS.some((t) => t.id === hash)) {
        setActiveTab(hash);
      } else {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setActiveTocId(hash);
        }
      }
    };

    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // IntersectionObserver for active TOC heading highlighting
  useEffect(() => {
    const headings = TOC_MAP[activeTab] || [];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveTocId(visible.target.id);
        }
      },
      { rootMargin: '-70px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab]);

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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNavItem = (sectionId: string, itemId: string) => {
    if (sectionId !== activeTab) {
      setActiveTab(sectionId);
    }
    setActiveNavId(itemId);
    const targetEl = document.getElementById(itemId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTocHeading = (id: string) => {
    setActiveTocId(id);
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSelect = (item: SearchDocItem) => {
    setActiveTab(item.sectionId);
    window.location.hash = item.id;
    setTimeout(() => {
      const el = document.getElementById(item.id) || document.getElementById(item.sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const meta = TAB_METADATA[activeTab] || TAB_METADATA.cli;
  const headings = TOC_MAP[activeTab] || [];

  return (
    <div className="docs-page-root">
      {/* Top Header & Horizontal Subnavigation */}
      <DocsHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAskAi={() => setIsAskAiOpen(true)}
        user={user}
      />

      {/* 3-Column Documentation Body */}
      <div className="docs-body-wrapper">
        <div className="docs-body-container">
          {/* Left Column: Navigation Sidebar */}
          <DocsLeftNav
            activeSection={activeTab}
            activeItem={activeNavId}
            onSelectItem={handleSelectNavItem}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />

          {/* Center Column: Main Reading Article */}
          <main className="docs-main-article" tabIndex={-1}>
            {/* Article Top Title & Copy Button */}
            <div className="docs-article-header">
              <div className="docs-article-header-left">
                <div className="docs-eyebrow-tag">{meta.eyebrow}</div>
                <h1 className="docs-article-title">{meta.title}</h1>
              </div>

              <div className="docs-article-header-right">
                <DocsCopyPageButton pageTitle={meta.title} />
              </div>
            </div>

            {/* Content Section by Tab */}
            <div className="docs-article-content">
              {activeTab === 'cli' && (
                <CliDocSection
                  onCopy={handleCopy}
                  copiedSnippet={copiedSnippet}
                  onNavigateNext={() => handleTabChange('sdk')}
                />
              )}
              {activeTab === 'sdk' && (
                <SdkDocSection
                  onCopy={handleCopy}
                  copiedSnippet={copiedSnippet}
                  onNavigateNext={() => handleTabChange('mcp')}
                />
              )}
              {activeTab === 'mcp' && (
                <McpDocSection
                  onCopy={handleCopy}
                  copiedSnippet={copiedSnippet}
                  onNavigateNext={() => handleTabChange('api')}
                />
              )}
              {activeTab === 'api' && (
                <ApiDocSection
                  onCopy={handleCopy}
                  copiedSnippet={copiedSnippet}
                  onNavigateNext={() => handleTabChange('security')}
                />
              )}
              {activeTab === 'security' && (
                <SecurityDocSection
                  onCopy={handleCopy}
                  copiedSnippet={copiedSnippet}
                  onNavigateNext={() => handleTabChange('cli')}
                />
              )}
            </div>
          </main>

          {/* Right Column: "On this page" Table of Contents */}
          <DocsRightToc
            headings={headings}
            activeId={activeTocId}
            onSelectHeading={handleSelectTocHeading}
          />
        </div>
      </div>

      {/* Command Palette Modal */}
      <DocsSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
      />

      {/* Ask AI Assistant Modal */}
      <DocsAskAiModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
      />
    </div>
  );
};
