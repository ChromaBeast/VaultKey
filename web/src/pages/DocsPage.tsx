import React, { useState } from 'react';
import { Package, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
import { copyText } from '../hooks/useClipboard';

type DocTab = 'cli' | 'sdk' | 'api' | 'security';

const TABS: Array<{ id: DocTab; label: string; icon: React.ReactNode }> = [
  { id: 'cli', label: 'CLI Tooling', icon: <Terminal size={14} /> },
  { id: 'sdk', label: 'SDK Integration', icon: <Package size={14} /> },
  { id: 'api', label: 'REST API', icon: <Zap size={14} /> },
  { id: 'security', label: 'Architecture & Threat Model', icon: <ShieldCheck size={14} /> },
];

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocTab>('cli');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    void copyText(code).then((ok) => {
      if (ok) {
        setCopiedSnippet(id);
        window.setTimeout(() => setCopiedSnippet(null), 2000);
      }
    });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--vk-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 600 }}>
          DOCUMENTATION
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--vk-text)' }}>
          Developer Guides & Technical Docs
        </h1>
        <p style={{ color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
          Integrate zero-trust secrets management with CLI workflows, Node.js, Python, and REST endpoints.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Documentation sections"
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          background: 'var(--vk-surface-1)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--vk-border)',
          width: 'fit-content',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSection(tab.id)}
              className="btn"
              style={{
                padding: '6px 14px',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--vk-surface-2)' : 'transparent',
                color: isActive ? 'var(--vk-text)' : 'var(--vk-text-muted)',
                border: `1px solid ${isActive ? 'var(--vk-border-strong)' : 'transparent'}`,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      <div className="glass" style={{ padding: '28px' }}>
        {activeSection === 'cli' && <CliDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />}
        {activeSection === 'sdk' && <SdkDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />}
        {activeSection === 'api' && <ApiDocSection />}
        {activeSection === 'security' && <SecurityDocSection />}
      </div>
    </div>
  );
};
