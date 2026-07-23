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

  return (
    <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Documentation & Developer Guides</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
          Integrate zero-trust secrets management with CLI, Node.js, Python, and REST APIs
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
        {[
          { id: 'cli', label: '🖥️ CLI Commands' },
          { id: 'sdk', label: '📦 Node.js & Python SDKs' },
          { id: 'api', label: '⚡ REST API' },
          { id: 'security', label: '🔒 Threat Model' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className="btn"
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: activeSection === tab.id ? 600 : 400,
              background: activeSection === tab.id ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'cli' && <CliDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />}
      {activeSection === 'sdk' && <SdkDocSection onCopy={handleCopy} copiedSnippet={copiedSnippet} />}
      {activeSection === 'api' && <ApiDocSection />}
      {activeSection === 'security' && <SecurityDocSection />}
    </div>
  );
};
