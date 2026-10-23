import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface McpDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

const MCP_CLIENTS = [
  { client: 'Claude Code', location: 'claude mcp add or project .mcp.json', note: 'Universal JSON' },
  { client: 'Claude Desktop', location: 'claude_desktop_config.json', note: 'Universal JSON' },
  { client: 'Codex CLI', location: '~/.codex/config.toml', note: 'TOML: [mcp_servers.vaultkey] with command, args, env' },
  { client: 'Gemini CLI', location: '~/.gemini/settings.json', note: 'Universal JSON' },
  { client: 'Cursor', location: '.cursor/mcp.json or ~/.cursor/mcp.json', note: 'Universal JSON' },
  { client: 'Antigravity', location: 'MCP settings in the app', note: 'Universal JSON' },
  { client: 'VS Code (Copilot)', location: '.vscode/mcp.json', note: 'Uses servers instead of mcpServers' },
  { client: 'Windsurf', location: '~/.codeium/windsurf/mcp_config.json', note: 'Universal JSON' },
  { client: 'Any other MCP client', location: 'See its docs', note: 'Command vaultkey, args ["mcp"], two env vars' },
];

const MCP_TOOLS = [
  { tool: 'list_projects', returns: 'Projects the token can see' },
  { tool: 'list_secret_names', returns: 'Names only, never values' },
  { tool: 'check_missing_secrets', returns: 'Which expected names are missing' },
  { tool: 'set_secret_value', returns: 'Creates or updates a secret' },
  { tool: 'run_with_secrets', returns: 'stdout and stderr only. Values never reach the model. Recommended.', highlight: true },
  { tool: 'get_secret_value', returns: 'Plaintext value into the model context. Use only when unavoidable.' },
];

export const McpDocSection: React.FC<McpDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const machineKeySnippet = `vaultkey keys create --label "<agent>"`;

  const universalJsonSnippet = `{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://your-vaultkey-server.com",
        "VAULTKEY_TOKEN": "vk_your_token_here"
      }
    }
  }
}`;

  const codexTomlSnippet = `[mcp_servers.vaultkey]
command = "vaultkey"
args = ["mcp"]

[mcp_servers.vaultkey.env]
VAULTKEY_SERVER = "https://your-vaultkey-server.com"
VAULTKEY_TOKEN = "vk_your_token_here"`;

  return (
    <section id="mcp" className="docs-subtopic-block scroll-mt-20">
      <h2 className="docs-h2 mb-2">MCP / AI agents</h2>
      <p className="docs-lead-text mb-6">
        <code className="text-sky-300 font-mono text-sm">vaultkey mcp</code> is built into the CLI binary, speaks stdio JSON-RPC, and calls the server over REST. Every call is written to the audit log.
      </p>

      {/* Setup */}
      <h3 className="docs-h3 mb-4">Setup</h3>
      <div className="space-y-6 mb-8">
        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            0. 1-Command CLI Setup (Recommended)
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Auto-configure your AI agent in one command (supports Claude Code, Cursor, Codex, Windsurf, Antigravity):
          </p>
          <DocsCodeBlock
            id="mcp-setup-code"
            language="bash"
            code={`vaultkey mcp setup cursor --write\nvaultkey mcp setup claude --write\nvaultkey mcp setup codex --write`}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>

        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            1. Manual setup: Create a machine key per agent
          </div>
          <DocsCodeBlock
            id="mcp-key-code"
            language="bash"
            code={machineKeySnippet}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>

        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            2. Universal config (most clients use this same shape)
          </div>
          <DocsCodeBlock
            id="mcp-universal-code"
            language="json"
            code={universalJsonSnippet}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>

        <div className="docs-section-card">
          <div className="text-sm font-semibold text-white mb-2">
            For Codex CLI (<code className="text-sky-300 font-mono text-xs">~/.codex/config.toml</code>)
          </div>
          <DocsCodeBlock
            id="mcp-codex-code"
            language="toml"
            code={codexTomlSnippet}
            copiedSnippet={copiedSnippet}
            onCopy={onCopy}
          />
        </div>
      </div>

      {/* Client Table */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-white mb-2">
          3. Client configuration locations
        </div>
        <div className="docs-table-wrap" role="region" aria-label="MCP clients table" tabIndex={0}>
          <table className="docs-compare-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '22%' }}>Client</th>
                <th scope="col" style={{ width: '43%' }}>Where the config goes</th>
                <th scope="col" style={{ width: '35%' }}>Format note</th>
              </tr>
            </thead>
            <tbody>
              {MCP_CLIENTS.map((item) => (
                <tr key={item.client}>
                  <td className="font-medium text-white">{item.client}</td>
                  <td><code className="text-sky-300 font-mono text-xs">{item.location}</code></td>
                  <td className="text-slate-300 text-xs">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Verify entries against each client's docs, as config locations change.
        </p>
      </div>

      {/* Available Tools */}
      <h3 className="docs-h3 mb-4">Available tools</h3>
      <div className="docs-table-wrap mb-4" role="region" aria-label="MCP tools table" tabIndex={0}>
        <table className="docs-compare-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '30%' }}>Tool</th>
              <th scope="col" style={{ width: '70%' }}>Returns</th>
            </tr>
          </thead>
          <tbody>
            {MCP_TOOLS.map((item) => (
              <tr key={item.tool}>
                <td>
                  <code className="text-sky-300 font-mono text-xs">{item.tool}</code>
                </td>
                <td className={item.highlight ? 'text-emerald-400 font-medium text-sm' : 'text-slate-300 text-sm'}>
                  {item.returns}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        <code className="text-sky-300 font-mono">run_with_secrets</code> arguments: <code className="text-slate-200">command</code>, <code className="text-slate-200">project</code>, <code className="text-slate-200">env</code>, <code className="text-slate-200">working_dir</code>.
      </p>

      {/* Tip */}
      <div className="p-4 rounded-lg bg-sky-950/30 border border-sky-500/20 text-sky-200 text-sm mb-6">
        <strong>Tip:</strong> Prefer <code className="font-mono text-sky-300">run_with_secrets</code> over <code className="font-mono text-sky-300">get_secret_value</code> so secret values never reach model context, and use one machine key per agent so it can be revoked alone.
      </div>

      {onNavigateNext && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNavigateNext}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            Continue to REST API →
          </button>
        </div>
      )}
    </section>
  );
};
