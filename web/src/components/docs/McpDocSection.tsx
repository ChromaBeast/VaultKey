import React, { useState } from 'react';
import { Bot, Terminal, Zap, Laptop } from 'lucide-react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';
import { DocsStepList } from './DocsStepList';

interface McpDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

interface ToolItem {
  name: string;
  description: string;
  safe: boolean;
  crown?: boolean;
  params: string;
}

const TOOLS: ToolItem[] = [
  {
    name: 'run_with_secrets',
    description: 'Execute a command in an isolated child process with secrets injected as environment variables. Only exit code, stdout, and stderr are returned to the agent—raw values never enter LLM context.',
    safe: true,
    crown: true,
    params: 'command, project, env, [working_dir]',
  },
  {
    name: 'list_projects',
    description: 'List all project names visible to the current machine API token.',
    safe: true,
    params: 'none',
  },
  {
    name: 'list_secret_names',
    description: 'List secret keys (metadata only, never plaintext values) for a given project and environment.',
    safe: true,
    params: 'project, env',
  },
  {
    name: 'check_missing_secrets',
    description: 'Diff a list of required variable names against VaultKey—returns which variables are missing without exposing existing values.',
    safe: true,
    params: 'project, env, expected_names[]',
  },
  {
    name: 'get_secret_value',
    description: 'Retrieve a single secret plaintext value directly into the LLM context window. Use with caution.',
    safe: false,
    params: 'project, env, key',
  },
  {
    name: 'set_secret_value',
    description: 'Create or update an encrypted secret value in VaultKey.',
    safe: true,
    params: 'project, env, key, value',
  },
];

export const McpDocSection: React.FC<McpDocProps> = ({ onCopy, copiedSnippet }) => {
  const [activeClientTab, setActiveClientTab] = useState<'claude' | 'cursor' | 'antigravity'>('claude');

  const claudeConfig = `// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://vaultkey.sheershjaiswal.in",
        "VAULTKEY_TOKEN": "vk_machine_agent_abc123..."
      }
    }
  }
}`;

  const cursorConfig = `// .cursor/mcp.json (project-specific) or ~/.cursor/mcp.json (global)
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://vaultkey.sheershjaiswal.in",
        "VAULTKEY_TOKEN": "vk_machine_agent_abc123..."
      }
    }
  }
}`;

  const antigravityConfig = `// antigravity.json / windsurf mcp settings
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://vaultkey.sheershjaiswal.in",
        "VAULTKEY_TOKEN": "vk_machine_agent_abc123..."
      }
    }
  }
}`;

  const step1Code = `# Create an isolated machine key for your agent
vaultkey keys create --label "claude-code-agent"
# Output:
# Token: vk_mach_8f92b7c104e67d2a901e4a52`;

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
      {/* Lead Text matching screenshot */}
      <div id="mcp-intro" className="docs-subtopic-block">
        <p className="docs-lead-text">
          Skills and MCP tools package domain expertise, such as workflows, best practices, and
          runtime credentials, into reusable capabilities. The AI agent gets a structured schema
          of the tools on startup and discovers or injects secrets only when relevant to the task.
        </p>

        <p className="docs-lead-text">
          Skills help you avoid context bloat and credential theft by loading only summaries at
          startup. Using <code className="docs-inline-code">run_with_secrets</code>, subcommands receive
          runtime environment variables in memory, ensuring API keys and passwords never enter the LLM's
          prompt context.
        </p>

        {/* Callout matching the LangChain screenshot */}
        <DocsCallout type="tip" title="Ready-to-use agent integration">
          For ready-to-use agent setups that connect directly to VaultKey ecosystem tasks, see the{' '}
          <a href="#mcp-claude" className="docs-link-accent">Claude Code</a> and{' '}
          <a href="#mcp-cursor" className="docs-link-accent">Cursor</a> configurations below.
        </DocsCallout>
      </div>

      {/* Usage Section with Step List matching screenshot */}
      <div id="mcp-usage" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Usage</h3>

        <DocsStepList
          steps={[
            {
              number: 1,
              title: 'Create a dedicated agent machine token',
              description: (
                <span>
                  Generate an isolated machine key scoped strictly to your project or staging environment
                  using the CLI or Web Dashboard.
                </span>
              ),
              content: (
                <DocsCodeBlock
                  id="mcp-step1"
                  language="Shell"
                  code={step1Code}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 2,
              title: 'Add the VaultKey MCP server to your agent client',
              description: (
                <span>
                  Configure your AI coding assistant (<code className="docs-inline-code">Claude Desktop</code>,{' '}
                  <code className="docs-inline-code">Cursor</code>, or <code className="docs-inline-code">Antigravity</code>)
                  to launch <code className="docs-inline-code">vaultkey mcp</code> via standard input/output.
                </span>
              ),
              content: (
                <div className="docs-tabbed-code-box">
                  <div className="docs-tabbed-header">
                    <div className="docs-tabbed-tabs">
                      <button
                        type="button"
                        className={`docs-tabbed-btn ${activeClientTab === 'claude' ? 'is-active' : ''}`}
                        onClick={() => setActiveClientTab('claude')}
                      >
                        Claude Desktop / Code
                      </button>
                      <button
                        type="button"
                        className={`docs-tabbed-btn ${activeClientTab === 'cursor' ? 'is-active' : ''}`}
                        onClick={() => setActiveClientTab('cursor')}
                      >
                        Cursor IDE
                      </button>
                      <button
                        type="button"
                        className={`docs-tabbed-btn ${activeClientTab === 'antigravity' ? 'is-active' : ''}`}
                        onClick={() => setActiveClientTab('antigravity')}
                      >
                        Antigravity / Windsurf
                      </button>
                    </div>
                  </div>

                  {activeClientTab === 'claude' && (
                    <DocsCodeBlock
                      id="mcp-claude-cfg"
                      language="JSON"
                      code={claudeConfig}
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
                  {activeClientTab === 'antigravity' && (
                    <DocsCodeBlock
                      id="mcp-antigravity-cfg"
                      language="JSON"
                      code={antigravityConfig}
                      copiedSnippet={copiedSnippet}
                      onCopy={onCopy}
                    />
                  )}
                </div>
              ),
            },
            {
              number: 3,
              title: 'Execute tasks safely via run_with_secrets',
              description: (
                <span>
                  When the agent needs to run database migrations, integration tests, or deploy scripts, it calls{' '}
                  <code className="docs-inline-code">run_with_secrets</code>. The subshell receives decrypted secrets in memory,
                  and only exit code and stdout/stderr stream back to the model.
                </span>
              ),
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

      {/* Available Tools Reference */}
      <div id="mcp-tools" className="docs-subtopic-block mt-14">
        <h3 className="docs-h3">Available MCP tools</h3>
        <p className="docs-text-muted mb-6">
          Every tool exposed by <code className="docs-inline-code">vaultkey mcp</code> to connected LLMs:
        </p>

        <div className="docs-mcp-tools-grid">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className={`docs-mcp-tool-card ${tool.crown ? 'is-crown' : ''}`}
            >
              <div className="docs-mcp-tool-top">
                <code className="docs-mcp-tool-func">{tool.name}</code>
                <div className="docs-mcp-tool-badges">
                  {tool.crown && (
                    <span className="docs-badge docs-badge--crown">
                      <Zap size={11} /> Recommended
                    </span>
                  )}
                  <span className={`docs-badge ${tool.safe ? 'docs-badge--safe' : 'docs-badge--warn'}`}>
                    {tool.safe ? 'Safe (Zero Leak)' : 'Reveals Plaintext'}
                  </span>
                </div>
              </div>

              <p className="docs-mcp-tool-desc">{tool.description}</p>

              <div className="docs-mcp-tool-params">
                <span className="docs-mcp-param-label">Arguments:</span>
                <code className="docs-mcp-param-code">{tool.params}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-Leak Security Guarantee */}
      <div id="mcp-safe-exec" className="docs-subtopic-block mt-14">
        <h3 className="docs-h3">Security architecture: how zero-leak execution works</h3>
        <p className="docs-text-muted mb-4">
          Most secrets managers force developers or agents to retrieve plaintext strings over the wire.
          With VaultKey MCP, values never leave the host system:
        </p>

        <div className="docs-mcp-flow-diagram">
          <div className="docs-flow-node">
            <Bot size={20} className="text-sky-400" />
            <div className="docs-flow-node-title">AI Coding Agent</div>
            <div className="docs-flow-node-sub">Claude / Cursor</div>
          </div>
          <div className="docs-flow-arrow">
            <span>JSON-RPC</span>
            <div className="docs-flow-arrow-line" />
            <span>(tool call)</span>
          </div>
          <div className="docs-flow-node">
            <Terminal size={20} className="text-emerald-400" />
            <div className="docs-flow-node-title">vaultkey mcp</div>
            <div className="docs-flow-node-sub">Local Process Subshell</div>
          </div>
          <div className="docs-flow-arrow">
            <span>In-memory inject</span>
            <div className="docs-flow-arrow-line" />
            <span>(no disk write)</span>
          </div>
          <div className="docs-flow-node">
            <Laptop size={20} className="text-indigo-400" />
            <div className="docs-flow-node-title">Target Command</div>
            <div className="docs-flow-node-sub">npm / python / docker</div>
          </div>
        </div>

        <DocsCallout type="security" title="Tamper-evident audit trail">
          Every agent action—whether listing names or invoking <code className="docs-inline-code">run_with_secrets</code>—is
          cryptographically recorded in the team's HMAC audit chain. If an unauthorized tool call occurs, it is
          immediately flaggable in the VaultKey Audit view.
        </DocsCallout>
      </div>
    </div>
  );
};
