import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface QuickstartDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

export const QuickstartDocSection: React.FC<QuickstartDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const envSnippet = `# Set your VaultKey server URL and token
export VAULTKEY_SERVER="https://your-vaultkey-server.com"
export VAULTKEY_TOKEN="vk_your_token_here"`;

  const runSnippet = `# Option A: Write secrets to a local .env file
vaultkey pull --project=backend --env=production

# Option B: Run a command with secrets injected into memory (nothing written to disk)
vaultkey run --project=backend -- npm start`;

  return (
    <section id="quickstart" className="docs-subtopic-block scroll-mt-20">
      <h2 className="docs-h2 mb-2">Quickstart</h2>
      <p className="docs-lead-text mb-6">
        Set your server and token, then pull secrets or run your app directly.
      </p>

      <div className="space-y-6">
        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            1. Set your environment variables
          </div>
          <DocsCodeBlock
            id="quickstart-env-code"
            language="bash"
            code={envSnippet}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>

        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            2. Pull secrets to a local .env file or run your command directly
          </div>
          <DocsCodeBlock
            id="quickstart-run-code"
            language="bash"
            code={runSnippet}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>

        <div className="docs-section-card flex items-center justify-between">
          <div className="text-sm font-semibold text-emerald-400">
            3. Done. Your process has its secrets.
          </div>
          {onNavigateNext && (
            <button
              type="button"
              onClick={onNavigateNext}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Continue to CLI →
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
