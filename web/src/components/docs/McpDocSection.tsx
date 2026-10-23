import React from 'react';
import { Bot, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { DocsCodeBlock } from './DocsCodeBlock';

interface McpDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

interface ToolItem {
  name: string;
  description: string;
  safe: boolean;
  crown?: boolean;
}

const TOOLS: ToolItem[] = [
  {
    name: 'list_projects',
    description: 'List all projects visible to the current API token.',
    safe: true,
  },
  {
    name: 'list_secret_names',
    description: 'List secret names (never values) for a project/environment.',
    safe: true,
  },
  {
    name: 'check_missing_secrets',
    description: 'Diff a list of expected names against VaultKey — returns only what is missing.',
    safe: true,
  },
  {
    name: 'get_secret_value',
    description: "Retrieve a single secret's plaintext value into the LLM context.",
    safe: false,
  },
  {
    name: 'set_secret_value',
    description: 'Create or update a secret in VaultKey.',
    safe: true,
  },
  {
    name: 'run_with_secrets',
    description: 'Run a shell command with secrets injected as env vars. Only stdout/stderr is returned — values never enter the LLM context.',
    safe: true,
    crown: true,
  },
];

export const McpDocSection: React.FC<McpDocProps> = ({ onCopy, copiedSnippet }) => {
  const claudeConfig = `// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://your-vaultkey-server.com",
        "VAULTKEY_TOKEN": "vk_your_machine_key_here"
      }
    }
  }
}`;

  const cursorConfig = `// .cursor/mcp.json  (project) or ~/.cursor/mcp.json  (global)
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://your-vaultkey-server.com",
        "VAULTKEY_TOKEN": "vk_your_machine_key_here"
      }
    }
  }
}`;

  const setupCode = `# 1. Create a dedicated machine key for the agent
vaultkey keys create --label "claude-code"
# → vk_abc123...

# 2. Confirm the server is reachable
VAULTKEY_SERVER=https://your-server.com VAULTKEY_TOKEN=vk_abc123 vaultkey mcp`;

  const runExample = `// Agent calls this tool instead of get_secret_value
{
  "tool": "run_with_secrets",
  "arguments": {
    "command": "python manage.py migrate",
    "project": "myapp",
    "env": "production",
    "working_dir": "/workspace/myapp"
  }
}

// Agent only receives stdout/stderr:
// "Applying auth.0001_initial... OK\nApplying auth.0002... OK"
// DATABASE_URL=postgres://... is never returned.`;

  return (
    <div className="docs-mcp-root">
      {/* How it works */}
      <div className="docs-mcp-flow">
        <div className="docs-mcp-flow-step">
          <Bot size={18} aria-hidden="true" />
          <span>AI agent</span>
        </div>
        <div className="docs-mcp-flow-arrow">stdio JSON-RPC</div>
        <div className="docs-mcp-flow-step">
          <Terminal size={18} aria-hidden="true" />
          <span><code>vaultkey mcp</code></span>
        </div>
        <div className="docs-mcp-flow-arrow">REST API</div>
        <div className="docs-mcp-flow-step">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>VaultKey server</span>
        </div>
      </div>

      <p className="docs-mcp-lead">
        <code>vaultkey mcp</code> is a zero-dependency MCP server built into the CLI binary. Agents
        get structured access to your secrets — all access is logged in the tamper-evident audit ledger.
      </p>

      {/* Prerequisites */}
      <div className="docs-example">
        <h3>Setup</h3>
        <DocsCodeBlock
          id="mcp-setup"
          language="Shell"
          code={setupCode}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      {/* Client configs */}
      <div className="docs-example">
        <h3>Claude Desktop / Claude Code</h3>
        <DocsCodeBlock
          id="mcp-claude"
          language="JSON"
          code={claudeConfig}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      <div className="docs-example">
        <h3>Cursor</h3>
        <DocsCodeBlock
          id="mcp-cursor"
          language="JSON"
          code={cursorConfig}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      {/* Tool reference */}
      <div className="docs-example">
        <h3>Available tools</h3>
        <div className="docs-mcp-tools">
          {TOOLS.map((tool) => (
            <div key={tool.name} className={`docs-mcp-tool${tool.crown ? ' docs-mcp-tool--crown' : ''}`}>
              <div className="docs-mcp-tool-header">
                <code className="docs-mcp-tool-name">{tool.name}</code>
                <span className={`docs-mcp-tool-badge${tool.safe ? '' : ' docs-mcp-tool-badge--warn'}`}>
                  {tool.safe ? 'Safe' : 'Reveals value'}
                </span>
                {tool.crown && (
                  <span className="docs-mcp-tool-badge docs-mcp-tool-badge--crown">
                    <Zap size={11} aria-hidden="true" /> Recommended
                  </span>
                )}
              </div>
              <p className="docs-mcp-tool-desc">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* run_with_secrets deep-dive */}
      <div className="docs-example">
        <h3>
          <code>run_with_secrets</code> — the secure way to use secrets
        </h3>
        <p className="docs-mcp-note">
          Secrets are injected into the child process environment and <strong>never returned to the agent</strong>. Only stdout/stderr come back. This is the recommended pattern for any workflow where the agent only needs a process to have access to a value.
        </p>
        <DocsCodeBlock
          id="mcp-run"
          language="JSON"
          code={runExample}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
};
