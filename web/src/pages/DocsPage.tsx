import React, { useEffect, useRef, useState } from 'react';
import { Bot, Package, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
import { McpDocSection } from '../components/docs/McpDocSection';
import { copyText } from '../hooks/useClipboard';

const SECTIONS = [
  { id: 'cli',      label: 'CLI tooling',    icon: Terminal   },
  { id: 'sdk',      label: 'SDK',            icon: Package    },
  { id: 'mcp',      label: 'MCP / AI agents',icon: Bot        },
  { id: 'api',      label: 'REST API',       icon: Zap        },
  { id: 'security', label: 'Security model', icon: ShieldCheck },
] as const;

type DocSection = (typeof SECTIONS)[number]['id'];

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>(() => {
    const hash = window.location.hash.slice(1);
    return SECTIONS.some((s) => s.id === hash) ? (hash as DocSection) : 'cli';
  });
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = 'Developer docs | VaultKey';
    const hash = window.location.hash.slice(1);
    const frame = window.requestAnimationFrame(() => {
      if (SECTIONS.some((s) => s.id === hash)) document.getElementById(hash)?.scrollIntoView();
    });

    const syncHash = () => {
      const section = window.location.hash.slice(1);
      if (SECTIONS.some((s) => s.id === section)) setActiveSection(section as DocSection);
    };
    window.addEventListener('hashchange', syncHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id as DocSection);
      },
      { rootMargin: '-80px 0px -50% 0px', threshold: 0.1 },
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(copyTimer.current);
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  const handleCopy = (id: string, code: string) => {
    void copyText(code).then((ok) => {
      if (!ok) return;
      setCopiedSnippet(id);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopiedSnippet(null), 2000);
    });
  };

  return (
    <div className="docs-page animate-fade">
      <div className="docs-intro">
        <div className="docs-intro-eyebrow">Documentation</div>
        <h1>Developer docs</h1>
        <p>
          Guides for the CLI, SDKs, MCP agent integration, REST API, and VaultKey's
          security model.
        </p>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav className="docs-nav" aria-label="Documentation sections">
            <span className="docs-nav-label">Guides</span>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="docs-nav-link"
                  aria-current={activeSection === section.id ? 'location' : undefined}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{section.label}</span>
                  {section.id === 'mcp' && (
                    <span className="docs-nav-badge">New</span>
                  )}
                </a>
              );
            })}
          </nav>
        </aside>

        <div className="docs-content">
          {/* CLI */}
          <section id="cli" className="docs-section" aria-labelledby="docs-cli-title">
            <div className="docs-section-heading">
              <div className="docs-section-eyebrow">
                <Terminal size={14} aria-hidden="true" />
                <span>CLI tooling</span>
              </div>
              <h2 id="docs-cli-title">Command-line interface</h2>
              <p>Authenticate, sync local variables, and inject secrets into a child process.</p>
            </div>
            <CliDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
          </section>

          {/* SDK */}
          <section id="sdk" className="docs-section" aria-labelledby="docs-sdk-title">
            <div className="docs-section-heading">
              <div className="docs-section-eyebrow">
                <Package size={14} aria-hidden="true" />
                <span>SDK integration</span>
              </div>
              <h2 id="docs-sdk-title">SDKs</h2>
              <p>Read secrets from Node.js and Python services at runtime.</p>
            </div>
            <SdkDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
          </section>

          {/* MCP */}
          <section id="mcp" className="docs-section" aria-labelledby="docs-mcp-title">
            <div className="docs-section-heading">
              <div className="docs-section-eyebrow docs-section-eyebrow--accent">
                <Bot size={14} aria-hidden="true" />
                <span>MCP / AI agents</span>
                <span className="docs-eyebrow-badge">New</span>
              </div>
              <h2 id="docs-mcp-title">MCP agent integration</h2>
              <p>
                Give AI coding agents (Claude Code, Cursor, Antigravity) structured access to
                your secrets — without leaking values into the LLM context window.
              </p>
            </div>
            <McpDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
          </section>

          {/* REST API */}
          <section id="api" className="docs-section" aria-labelledby="docs-api-title">
            <div className="docs-section-heading">
              <div className="docs-section-eyebrow">
                <Zap size={14} aria-hidden="true" />
                <span>REST API</span>
              </div>
              <h2 id="docs-api-title">REST API</h2>
              <p>Core endpoints for authentication, encrypted values, and one-time sharing.</p>
            </div>
            <ApiDocSection />
          </section>

          {/* Security */}
          <section id="security" className="docs-section" aria-labelledby="docs-security-title">
            <div className="docs-section-heading">
              <div className="docs-section-eyebrow">
                <ShieldCheck size={14} aria-hidden="true" />
                <span>Security model</span>
              </div>
              <h2 id="docs-security-title">Security model</h2>
              <p>How VaultKey derives keys, encrypts values, and verifies the audit chain.</p>
            </div>
            <SecurityDocSection />
          </section>
        </div>
      </div>
    </div>
  );
};
