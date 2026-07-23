import React from 'react';

interface SdkDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

export const SdkDocSection: React.FC<SdkDocProps> = ({ onCopy, copiedSnippet }) => {
  const nodeCode = `import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({
  serverUrl: process.env.VAULTKEY_SERVER,
  apiKey: process.env.VAULTKEY_TOKEN
});

// Load secrets directly into process.env in-memory
await vk.inject('backend', 'production');

// Retrieve a single secret
const dbUri = await vk.get('DATABASE_URL');`;

  const pythonCode = `from vaultkey import Vaultkey

vk = Vaultkey(
    server_url="https://your-vaultkey-server.com",
    api_key="vk_admin.abc123xyz"
)

# Load secrets directly into os.environ in-memory
vk.inject(project="backend", env="production")`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Node.js / TypeScript</h3>
          <button onClick={() => onCopy('node', nodeCode)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            {copiedSnippet === 'node' ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="code-font" style={{ background: '#090d16', padding: '14px', borderRadius: '10px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: '#6366f1', fontSize: '0.8rem', lineHeight: '1.5' }}>
          {nodeCode}
        </pre>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Python SDK</h3>
          <button onClick={() => onCopy('py', pythonCode)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            {copiedSnippet === 'py' ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="code-font" style={{ background: '#090d16', padding: '14px', borderRadius: '10px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: '#a855f7', fontSize: '0.8rem', lineHeight: '1.5' }}>
          {pythonCode}
        </pre>
      </div>
    </div>
  );
};
