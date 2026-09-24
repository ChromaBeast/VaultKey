import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

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
    <div className="docs-examples">
      <div className="docs-example">
        <h3>Node.js / TypeScript</h3>
        <DocsCodeBlock
          id="node"
          language="TypeScript"
          code={nodeCode}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      <div className="docs-example">
        <h3>Python</h3>
        <DocsCodeBlock
          id="py"
          language="Python"
          code={pythonCode}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
};
