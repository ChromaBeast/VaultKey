import React, { useState } from 'react';
import { CliDocSection } from '../components/docs/CliDocSection';
import { SdkDocSection } from '../components/docs/SdkDocSection';
import { ApiDocSection } from '../components/docs/ApiDocSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'cli' | 'sdk' | 'api' | 'security'>('cli');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const tabs = [
    { id: 'cli', label: '🖥️ CLI Tooling' },
    { id: 'sdk', label: '📦 SDK Integration' },
    { id: 'api', label: '⚡ REST API Reference' },
    { id: 'security', label: '🔒 Threat Model & Security' },
  ];

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
          Documentation & Developer Guides
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
          Integrate zero-trust secrets management with CLI, Node.js, Python, and REST APIs
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className="btn"
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                background: isActive
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid ' + (isActive ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.08)'),
                boxShadow: isActive ? '0 4px 20px rgba(139, 92, 246, 0.35)' : 'none',
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeSection === 'cli' && <CliDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />}
      {activeSection === 'sdk' && <SdkDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />}
      {activeSection === 'api' && <ApiDocSection />}
      {activeSection === 'security' && <SecurityDocSection />}
    </div>
  );
};
