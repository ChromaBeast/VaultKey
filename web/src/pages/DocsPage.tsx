import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DocsHeader } from '../components/docs/DocsHeader';
import { DOC_TABS, type SearchDocItem } from '../components/docs/docsData';
import { DocsLeftNav } from '../components/docs/DocsLeftNav';
import { DocsRightToc, type TocHeading } from '../components/docs/DocsRightToc';
import { DocsSearchModal } from '../components/docs/DocsSearchModal';
import { DocsAskAiModal } from '../components/docs/DocsAskAiModal';
import { DocsCopyPageButton } from '../components/docs/DocsCopyPageButton';
import { OverviewDocSection } from '../components/docs/OverviewDocSection';
import { McpDocSection } from '../components/docs/McpDocSection';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
import { copyText } from '../hooks/useClipboard';

const TOC_MAP: Record<string, TocHeading[]> = {
  overview: [
    { id: 'overview-intro', title: 'Usage', level: 2 },
    { id: 'overview-quickstart', title: 'Quickstart (30 seconds)', level: 2 },
    { id: 'overview-arch', title: 'Zero-knowledge architecture', level: 2 },
    { id: 'overview-compare', title: 'Comparison with Vault & Infisical', level: 2 },
  ],
  mcp: [
    { id: 'mcp-intro', title: 'Usage', level: 2 },
    { id: 'mcp-usage', title: 'Agent setup flow', level: 2 },
    { id: 'mcp-tools', title: 'Available MCP tools', level: 2 },
    { id: 'mcp-safe-exec', title: 'Zero-leak security proof', level: 2 },
  ],
  cli: [
    { id: 'cli-intro', title: 'Overview', level: 2 },
    { id: 'cli-usage', title: 'CLI workflow', level: 2 },
  ],
  sdk: [
    { id: 'sdk-intro', title: 'Client libraries', level: 2 },
    { id: 'sdk-examples', title: 'Language examples', level: 2 },
  ],
  api: [
    { id: 'api-intro', title: 'API overview', level: 2 },
    { id: 'api-endpoints-table', title: 'Core endpoints', level: 2 },
    { id: 'api-curl', title: 'Example cURL request', level: 2 },
  ],
  security: [
    { id: 'sec-intro', title: 'Security model', level: 2 },
    { id: 'sec-kdf', title: '1. Argon2id Key Derivation', level: 2 },
    { id: 'sec-gcm', title: '2. AES-256-GCM Encryption', level: 2 },
    { id: 'sec-zero', title: '3. In-Memory Key Zeroing', level: 2 },
    { id: 'sec-audit', title: '4. HMAC Tamper-Proof Ledger', level: 2 },
  ],
  architecture: [
    { id: 'overview-arch', title: 'Architecture components', level: 2 },
    { id: 'overview-compare', title: 'Comparison matrix', level: 2 },
  ],
};

const TAB_METADATA: Record<string, { eyebrow: string; title: string; desc: string }> = {
  overview: {
    eyebrow: 'Get Started',
    title: 'Overview & Quickstart',
    desc: 'Introduction to VaultKey zero-knowledge secrets management and developer workflows.',
  },
  mcp: {
    eyebrow: 'Context management',
    title: 'Skills & Model Context Protocol (MCP)',
    desc: 'Connect AI coding agents (Claude Code, Cursor, Antigravity) to secrets with zero LLM context leakage.',
  },
  cli: {
    eyebrow: 'Command Line',
    title: 'CLI Tooling',
    desc: 'Authenticate, pull, push, and inject variables into processes without writing to disk.',
  },
  sdk: {
    eyebrow: 'Integration',
    title: 'SDKs & Client Libraries',
    desc: 'Read secrets from TypeScript / Node.js, Python, and Go microservices in memory.',
  },
  api: {
    eyebrow: 'Reference',
    title: 'REST API',
    desc: 'Core endpoints for organizations, encrypted variables, ephemeral shares, and audit records.',
  },
  security: {
    eyebrow: 'Cryptography',
    title: 'Security Architecture',
    desc: 'How VaultKey derives keys, encrypts values, zeros RAM memory, and validates hash chains.',
  },
  architecture: {
    eyebrow: 'System Design',
    title: 'System Architecture',
    desc: 'Single-binary Go and SQLite engine with client-side cryptography.',
  },
};

export const DocsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.slice(1);
    if (hash && (TOC_MAP[hash] || hash in TAB_METADATA)) return hash;
    return 'mcp'; // Default to the stellar MCP / Agent view matching user request!
  });

  const [activeNavId, setActiveNavId] = useState<string>('mcp-intro');
  const [activeTocId, setActiveTocId] = useState<string>('mcp-intro');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = `${TAB_METADATA[activeTab]?.title || 'Documentation'} | VaultKey`;
  }, [activeTab]);

  // Handle URL hash changes
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      // Check if hash matches a tab
      if (DOC_TABS.some((t) => t.id === hash)) {
        setActiveTab(hash);
      } else {
        // Check if hash matches an element id on the page
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

  const meta = TAB_METADATA[activeTab] || TAB_METADATA.mcp;
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
              {activeTab === 'overview' && (
                <OverviewDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
              )}
              {activeTab === 'mcp' && (
                <McpDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
              )}
              {activeTab === 'cli' && (
                <CliDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
              )}
              {activeTab === 'sdk' && (
                <SdkDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
              )}
              {activeTab === 'api' && (
                <ApiDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
              )}
              {activeTab === 'security' && (
                <SecurityDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
              )}
              {activeTab === 'architecture' && (
                <OverviewDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
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
