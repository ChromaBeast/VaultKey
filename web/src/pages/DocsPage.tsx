import React, { useEffect, useState } from 'react';
import { Package, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
import { copyText } from '../hooks/useClipboard';

const SECTIONS = [
  { id: 'cli', label: 'CLI tooling', icon: Terminal },
  { id: 'sdk', label: 'SDK integration', icon: Package },
  { id: 'api', label: 'REST API', icon: Zap },
  { id: 'security', label: 'Security model', icon: ShieldCheck },
] as const;

type DocSection = (typeof SECTIONS)[number]['id'];

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('cli');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  useEffect(() => {
    const updateActiveSection = () => {
      let current: DocSection = 'cli';
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 150) current = section.id;
      }
      setActiveSection(current);
    };

    const hash = window.location.hash.slice(1);
    const frame = SECTIONS.some((section) => section.id === hash)
      ? window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
      : 0;

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, []);

  const handleCopy = (id: string, code: string) => {
    void copyText(code).then((ok) => {
      if (!ok) return;
      setCopiedSnippet(id);
      window.setTimeout(() => setCopiedSnippet(null), 2000);
    });
  };

  return (
    <div className="docs-page animate-fade">
      <div className="docs-intro">
        <h1>Developer docs</h1>
        <p>Guides for the CLI, SDKs, REST API, and VaultKey security model.</p>
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
                  <Icon size={16} aria-hidden="true" />
                  <span>{section.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        <div className="docs-content">
          <section id="cli" className="docs-section" aria-labelledby="docs-cli-title">
            <div className="docs-section-heading">
              <h2 id="docs-cli-title">CLI tooling</h2>
              <p>Authenticate, sync local variables, and inject secrets into a child process.</p>
            </div>
            <CliDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
          </section>

          <section id="sdk" className="docs-section" aria-labelledby="docs-sdk-title">
            <div className="docs-section-heading">
              <h2 id="docs-sdk-title">SDK integration</h2>
              <p>Read secrets from Node.js and Python services at runtime.</p>
            </div>
            <SdkDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />
          </section>

          <section id="api" className="docs-section" aria-labelledby="docs-api-title">
            <div className="docs-section-heading">
              <h2 id="docs-api-title">REST API</h2>
              <p>Core endpoints for authentication, encrypted values, and one-time sharing.</p>
            </div>
            <ApiDocSection />
          </section>

          <section id="security" className="docs-section" aria-labelledby="docs-security-title">
            <div className="docs-section-heading">
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
