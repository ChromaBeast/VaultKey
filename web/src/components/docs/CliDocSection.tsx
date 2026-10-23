import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface CliDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

const CLI_COMMANDS = [
  { cmd: 'vaultkey init [--project=<p>] [--env=<e>]', desc: 'Initialize local .vaultkey.yaml workspace config' },
  { cmd: 'vaultkey pull [--project=<p>] [--env=<e>]', desc: 'Write secrets to a local .env' },
  { cmd: 'vaultkey push [--project=<p>] [--file=<path>]', desc: 'Upload a local env file' },
  { cmd: 'vaultkey run [--project=<p>] -- <cmd>', desc: 'Run a command with secrets injected, nothing written to disk' },
  { cmd: 'vaultkey keys create --label "<name>"', desc: 'Create a machine key' },
  { cmd: 'vaultkey mcp', desc: 'Start the MCP server' },
  { cmd: 'vaultkey mcp setup <agent> [--write]', desc: 'Configure MCP for Claude, Cursor, Codex, Windsurf, Antigravity' },
];

export const CliDocSection: React.FC<CliDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const cliExample = `# Pull secrets to local .env
vaultkey pull --project=backend --env=production

# Upload a local env file
vaultkey push --project=backend --file=.env

# Run a command with secrets injected (nothing written to disk)
vaultkey run --project=backend -- npm start

# Create a machine key
vaultkey keys create --label "ci-runner"

# Start the MCP server
vaultkey mcp`;

  return (
    <section id="cli" className="docs-subtopic-block scroll-mt-20">
      <h2 className="docs-h2 mb-2">CLI</h2>
      <p className="docs-lead-text mb-6">
        Authenticate, sync local files, inject secrets into processes, or manage keys.
      </p>

      <div className="mb-8">
        <DocsCodeBlock
          id="cli-example-code"
          language="bash"
          code={cliExample}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      <div className="docs-table-wrap mb-6" role="region" aria-label="CLI commands reference" tabIndex={0}>
        <table className="docs-compare-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '55%' }}>Command</th>
              <th scope="col" style={{ width: '45%' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {CLI_COMMANDS.map((item) => (
              <tr key={item.cmd}>
                <td>
                  <code className="text-sky-300 font-mono text-xs">{item.cmd}</code>
                </td>
                <td className="text-slate-300 text-sm">{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onNavigateNext && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNavigateNext}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            Continue to SDKs →
          </button>
        </div>
      )}
    </section>
  );
};
