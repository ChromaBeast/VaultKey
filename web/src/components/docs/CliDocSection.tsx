import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';
import { DocsStepList } from './DocsStepList';

interface CliDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

export const CliDocSection: React.FC<CliDocProps> = ({ onCopy, copiedSnippet }) => {
  const installCode = `# Install single static binary
curl -fsSL https://vaultkey.sheershjaiswal.in/install.sh | sh

# Verify installation
vaultkey version`;

  const authCode = `# Authenticate against VaultKey Cloud or self-hosted server
vaultkey login --server https://vaultkey.sheershjaiswal.in

# Or export environment variables in CI/CD
export VAULTKEY_SERVER="https://vaultkey.sheershjaiswal.in"
export VAULTKEY_TOKEN="vk_machine_ci_secret"`;

  const syncCode = `# Pull production secrets into local environment file
vaultkey pull --project=backend --env=production --file=.env.local

# Push and encrypt local file changes up to the vault
vaultkey push --project=backend --env=production --file=.env.local`;

  const runCode = `# Inject decrypted secrets directly into child process environment
# No .env file is ever created or written to disk!
vaultkey run --project=backend --env=production -- npm start

# Works with any runtime or executable
vaultkey run --project=ml-pipeline -- python train.py
vaultkey run --project=infra --env=prod -- terraform apply`;

  return (
    <div className="docs-cli-root">
      <div id="cli-intro" className="docs-subtopic-block">
        <p className="docs-lead-text">
          The VaultKey CLI is a single, zero-dependency static executable written in Go.
          It gives developers, CI/CD pipelines, and background daemons the ability to sync,
          rotate, and inject encrypted secrets directly into child processes in memory without
          writing plaintext values to disk.
        </p>

        <DocsCallout type="tip" title="Ephemeral in-memory injection">
          Never commit `.env` files or risk unencrypted keys lingering on disk. Use{' '}
          <code className="docs-inline-code">vaultkey run</code> to stream secrets exclusively to
          process memory.
        </DocsCallout>
      </div>

      <div id="cli-usage" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">CLI workflow</h3>

        <DocsStepList
          steps={[
            {
              number: 1,
              title: 'Install the CLI binary',
              description: 'Install via the official curl installer or download pre-built binaries for macOS, Linux, and Windows.',
              content: (
                <DocsCodeBlock
                  id="cli-install-snippet"
                  language="Shell"
                  code={installCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 2,
              title: 'Authenticate your machine or workstation',
              description: 'Log in interactively or set machine API tokens in your environment variables.',
              content: (
                <DocsCodeBlock
                  id="cli-auth-snippet"
                  language="Shell"
                  code={authCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 3,
              title: 'Sync local files (Optional)',
              description: 'Pull or push encrypted environment files when disk persistence is required.',
              content: (
                <DocsCodeBlock
                  id="cli-sync-snippet"
                  language="Shell"
                  code={syncCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 4,
              title: 'Zero-disk execution via vaultkey run',
              description: 'Launch applications with secrets decrypted on-the-fly and wiped immediately when the process terminates.',
              content: (
                <DocsCodeBlock
                  id="cli-run-snippet"
                  language="Shell"
                  code={runCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
