export type SupportedAgent = 'claude' | 'cursor' | 'codex' | 'antigravity' | 'windsurf';

export interface AgentDetail {
  id: SupportedAgent;
  name: string;
  badge: string;
  configPath: string;
  format: 'json' | 'toml';
  description: string;
  cliCommand?: (server: string, token: string) => string;
}

export const AGENTS: AgentDetail[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    badge: 'CLI & Desktop',
    configPath: '.mcp.json (or ~/.claude.json)',
    format: 'json',
    description: 'Anthropic Claude Code CLI, Claude Desktop, and Coworker agent.',
    cliCommand: (server, token) =>
      `claude mcp add --env VAULTKEY_SERVER=${server} --env VAULTKEY_TOKEN=${token} vaultkey -- vaultkey mcp`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    badge: 'IDE',
    configPath: '.cursor/mcp.json (or ~/.cursor/mcp.json)',
    format: 'json',
    description: 'Cursor AI Editor MCP integration for agents and chat.',
  },
  {
    id: 'codex',
    name: 'Codex',
    badge: 'CLI Agent',
    configPath: '~/.codex/config.toml',
    format: 'toml',
    description: 'Codex pair programmer & autonomous terminal workflows.',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    badge: 'Google AI',
    configPath: '~/.gemini/antigravity/mcp_config.json',
    format: 'json',
    description: 'Google DeepMind Antigravity pair-programming agent.',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    badge: 'Codeium',
    configPath: '~/.codeium/windsurf/mcp_config.json',
    format: 'json',
    description: 'Codeium Windsurf IDE Cascade agent.',
  },
];

export function generateAgentMcpConfig(format: 'json' | 'toml', server: string, token: string): string {
  if (format === 'toml') {
    return `[mcp_servers.vaultkey]
command = "vaultkey"
args = ["mcp"]

[mcp_servers.vaultkey.env]
VAULTKEY_SERVER = "${server}"
VAULTKEY_TOKEN = "${token}"`;
  }

  return JSON.stringify(
    {
      mcpServers: {
        vaultkey: {
          command: 'vaultkey',
          args: ['mcp'],
          env: {
            VAULTKEY_SERVER: server,
            VAULTKEY_TOKEN: token,
          },
        },
      },
    },
    null,
    2
  );
}

export function generateAgentSetupCommand(agentId: string, server: string, token: string): string {
  let cmd = `vaultkey mcp setup ${agentId} --write`;
  if (token && token !== 'YOUR_VAULTKEY_TOKEN') {
    cmd += ` --token=${token}`;
  }
  if (server && server !== 'http://localhost:8080') {
    cmd += ` --server=${server}`;
  }
  return cmd;
}

export function formatSecretsCommand(mode: 'run' | 'pull', project: string, env: string): string {
  const formattedProject = project.includes(' ') ? `"${project}"` : project;
  const formattedEnv = env.includes(' ') ? `"${env}"` : env;
  if (mode === 'run') {
    return `vaultkey run --project=${formattedProject} --env=${formattedEnv} -- <cmd>`;
  }
  return `vaultkey pull --project=${formattedProject} --env=${formattedEnv}`;
}
