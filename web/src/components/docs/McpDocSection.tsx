import React, { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';
import { DocsStepList } from './DocsStepList';

interface McpDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

export const McpDocSection: React.FC<McpDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const [activeClientTab, setActiveClientTab] = useState<'desktop' | 'code' | 'cursor'>('desktop');

  const setupKeySnippet = `# Create a dedicated machine key for your agent
vaultkey keys create --label "claude-code"
# Output:
# Token: vk_mach_8f92b7c104e67d2a901e4a52`;

  const claudeDesktopConfig = `// ~/Library/Application Support/Claude/claude_desktop_config.json
{
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

  const claudeCodeSetup = `# Configure Claude Code via CLI
export VAULTKEY_SERVER="https://your-vaultkey-server.com"
export VAULTKEY_TOKEN="vk_your_token_here"

# Add vaultkey MCP to Claude Code
claude mcp add vaultkey -- vaultkey mcp`;

  const cursorConfig = `// .cursor/mcp.json (project) or ~/.cursor/mcp.json (global)
{
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

  const runExample = `// Agent tool call invoking run_with_secrets
{
  "tool": "run_with_secrets",
  "arguments": {
    "command": "python manage.py migrate",
    "project": "backend",
    "env": "production",
    "working_dir": "/workspace/repo"
  }
}

// Agent response received (DATABASE_URL=postgres://... is NEVER returned):
{
  "exit_code": 0,
  "stdout": "Operations to perform: Apply all migrations: admin, auth, contenttypes... OK",
  "stderr": ""
}`;

  return (
    <div className="docs-mcp-root">
      {/* 1. Summary */}
      <div id="mcp-overview" className="docs-subtopic-block">
        <p className="docs-lead-text">
          Give AI coding agents (Claude Code, Cursor, Antigravity) structured access to your secrets—without leaking values into the LLM context window.
        </p>

        {/* 2. When to use this */}
        <div id="mcp-when" className="docs-section-card mt-6">
          <h4 className="docs-card-heading">When to use this</h4>
          <ul className="docs-bullet-list">
            <li>When AI coding agents need to run test suites, database migrations, or build commands that require runtime credentials.</li>
            <li>Checking whether required environment variables are set in a project without printing secret values into the chat window.</li>
            <li>Restricting agent actions so secrets are injected into local child processes and cannot be exfiltrated through LLM prompts.</li>
          </ul>
        </div>
      </div>

      {/* 3. Why run_with_secrets beats get_secret_value */}
      <div id="mcp-why" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Why run_with_secrets beats get_secret_value</h3>
        <p className="docs-lead-text font-medium text-white">
          Unlike <code className="docs-inline-code">get_secret_value</code>, which returns raw plaintext into the model context where it can leak into chat logs or training data, <code className="docs-inline-code">run_with_secrets</code> executes the command in an isolated child process with secrets injected as environment variables so only stdout and stderr are returned to the agent.
        </p>

        <DocsCallout type="warning" title="Security guardrail">
          Calling <code className="docs-inline-code">get_secret_value</code> puts plaintext directly in the model's context window. We recommend using <code className="docs-inline-code">run_with_secrets</code> and <code className="docs-inline-code">list_secret_names</code> instead for secure agent operations.
        </DocsCallout>
      </div>

      {/* 4. Prerequisites & Setup Steps */}
      <div id="mcp-steps" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Steps</h3>

        <DocsStepList
          steps={[
            {
              number: 1,
              title: 'Create a dedicated machine key per agent',
              description: 'Create an isolated machine key with least-privilege access so it can be audited or revoked on its own:',
              content: (
                <DocsCodeBlock
                  id="mcp-step-key"
                  language="Bash"
                  code={setupKeySnippet}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 2,
              title: 'Configure your AI agent client',
              description: 'Add a vaultkey entry to your client MCP configuration:',
              content: (
                <div className="docs-tabbed-code-box">
                  <div className="docs-tabbed-header">
                    <div className="docs-tabbed-tabs">
                      <button
                        type="button"
                        className={`docs-tabbed-btn ${activeClientTab === 'desktop' ? 'is-active' : ''}`}
                        onClick={() => setActiveClientTab('desktop')}
                      >
                        Claude Desktop
                      </button>
                      <button
                        type="button"
                        className={`docs-tabbed-btn ${activeClientTab === 'code' ? 'is-active' : ''}`}
                        onClick={() => setActiveClientTab('code')}
                      >
                        Claude Code
                      </button>
                      <button
                        type="button"
                        className={`docs-tabbed-btn ${activeClientTab === 'cursor' ? 'is-active' : ''}`}
                        onClick={() => setActiveClientTab('cursor')}
                      >
                        Cursor IDE
                      </button>
                    </div>
                  </div>

                  {activeClientTab === 'desktop' && (
                    <DocsCodeBlock
                      id="mcp-desktop-cfg"
                      language="JSON"
                      code={claudeDesktopConfig}
                      copiedSnippet={copiedSnippet}
                      onCopy={onCopy}
                    />
                  )}
                  {activeClientTab === 'code' && (
                    <DocsCodeBlock
                      id="mcp-code-cfg"
                      language="Bash"
                      code={claudeCodeSetup}
                      copiedSnippet={copiedSnippet}
                      onCopy={onCopy}
                    />
                  )}
                  {activeClientTab === 'cursor' && (
                    <DocsCodeBlock
                      id="mcp-cursor-cfg"
                      language="JSON"
                      code={cursorConfig}
                      copiedSnippet={copiedSnippet}
                      onCopy={onCopy}
                    />
                  )}
                </div>
              ),
            },
            {
              number: 3,
              title: 'Execute commands via run_with_secrets',
              description: 'The agent calls run_with_secrets to execute workloads without reading plaintext values:',
              content: (
                <DocsCodeBlock
                  id="mcp-run-example"
                  language="JSON"
                  code={runExample}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
          ]}
        />
      </div>

      {/* 5. Verify */}
      <div id="mcp-verify" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Verify</h3>
        <p className="docs-lead-text">
          Confirm that your agent can connect to the MCP server by prompting it:
        </p>
        <blockquote className="docs-prompt-quote">
          "List the available projects in VaultKey using your list_projects tool."
        </blockquote>
        <p className="docs-text-muted mt-2 text-sm">
          Expected output: The agent invokes <code className="docs-inline-code">list_projects</code> and displays project names visible to your machine key. All access is logged in the tamper-evident audit ledger.
        </p>
      </div>

      {/* 6. Reference Table */}
      <div id="mcp-tools" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Reference: Available tools</h3>
        <p className="docs-lead-text text-sm mb-4">
          The <span className="docs-badge docs-badge--safe">Safe</span> badge indicates that the tool <strong>does not return secret values to the model context</strong>. Only <code className="docs-inline-code">get_secret_value</code> reveals plaintext.
        </p>

        <div className="docs-table-wrap" role="region" aria-label="MCP tools reference table" tabIndex={0}>
          <table className="docs-compare-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '25%' }}>Tool</th>
                <th scope="col" style={{ width: '22%' }}>Safety</th>
                <th scope="col" style={{ width: '53%' }}>What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="docs-inline-code">list_projects</code></td>
                <td><span className="docs-badge docs-badge--safe">Safe</span></td>
                <td>Lists projects visible to the current token</td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">list_secret_names</code></td>
                <td><span className="docs-badge docs-badge--safe">Safe</span></td>
                <td>Lists secret names (never values) for a project and environment</td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">check_missing_secrets</code></td>
                <td><span className="docs-badge docs-badge--safe">Safe</span></td>
                <td>Compares expected names with VaultKey and returns only the missing ones</td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">get_secret_value</code></td>
                <td><span className="docs-badge docs-badge--warn">Reveals value</span></td>
                <td>Returns one secret's plaintext into the LLM context</td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">set_secret_value</code></td>
                <td><span className="docs-badge docs-badge--safe">Safe</span></td>
                <td>Creates or updates a secret (does not return secret values to the model)</td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">run_with_secrets</code></td>
                <td>
                  <span className="docs-badge docs-badge--crown">
                    <Zap size={11} /> Safe, recommended
                  </span>
                </td>
                <td>
                  Runs a shell command with secrets as environment variables. Only stdout and stderr return to the agent.
                  <div className="text-xs text-muted-foreground mt-1">Arguments: <code className="text-sky-300">command, project, env, working_dir</code></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Next */}
      <div className="docs-next-box mt-12">
        <div className="docs-next-label">Next guide</div>
        <button
          type="button"
          className="docs-next-link"
          onClick={onNavigateNext}
        >
          <span>REST API</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
