import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

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
    <div className="docs-example">
      <h3>Typical CLI flow</h3>
      <DocsCodeBlock
        id="cli"
        language="Shell"
        code={cliCode}
        copiedSnippet={copiedSnippet}
        onCopy={onCopy}
      />
    </div>
  );
};
