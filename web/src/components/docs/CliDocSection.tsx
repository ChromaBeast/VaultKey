import React from 'react';

interface CliDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

export const CliDocSection: React.FC<CliDocProps> = ({ onCopy, copiedSnippet }) => {
  const cliCode = `# 1. Authenticate with your VaultKey SaaS token
export VAULTKEY_SERVER="https://your-vaultkey-server.com"
export VAULTKEY_TOKEN="vk_admin.abc123xyz"

# 2. Pull environment variables into local .env file
vaultkey pull --project=backend --env=production

# 3. Push local .env variables up to VaultKey cloud
vaultkey push --project=frontend --file=.env.local

# 4. Inject secrets into a child process without writing to disk
vaultkey run --project=backend -- npm start`;

  return (
    <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>CLI Integration Guide</h3>
        <button onClick={() => onCopy('cli', cliCode)} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
          {copiedSnippet === 'cli' ? '✓ Copied!' : 'Copy Commands'}
        </button>
      </div>
      <pre className="code-font" style={{ background: '#090d16', padding: '18px', borderRadius: '12px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: '#10b981', fontSize: '0.85rem', lineHeight: '1.6' }}>
        {cliCode}
      </pre>
    </div>
  );
};
