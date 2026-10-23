import { describe, expect, test } from 'bun:test';
import { generateAgentMcpConfig, generateAgentSetupCommand, formatSecretsCommand } from '../src/lib/dx';

describe('AI Agent MCP Configuration generator', () => {
  const server = 'https://vault.example.com';
  const token = 'vk_agent_token_123';

  test('generates valid JSON MCP server configuration for Claude Code, Cursor, Antigravity, and Windsurf', () => {
    const jsonStr = generateAgentMcpConfig('json', server, token);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.mcpServers.vaultkey.command).toBe('vaultkey');
    expect(parsed.mcpServers.vaultkey.args).toEqual(['mcp']);
    expect(parsed.mcpServers.vaultkey.env.VAULTKEY_SERVER).toBe(server);
    expect(parsed.mcpServers.vaultkey.env.VAULTKEY_TOKEN).toBe(token);
  });

  test('generates valid TOML MCP server configuration for Codex CLI', () => {
    const tomlSnippet = generateAgentMcpConfig('toml', server, token);

    expect(tomlSnippet).toContain('[mcp_servers.vaultkey]');
    expect(tomlSnippet).toContain('command = "vaultkey"');
    expect(tomlSnippet).toContain('args = ["mcp"]');
    expect(tomlSnippet).toContain(`VAULTKEY_SERVER = "${server}"`);
    expect(tomlSnippet).toContain(`VAULTKEY_TOKEN = "${token}"`);
  });

  test('generates CLI setup command with custom token and custom server', () => {
    const defaultCmd = generateAgentSetupCommand('cursor', 'http://localhost:8080', 'YOUR_VAULTKEY_TOKEN');
    expect(defaultCmd).toBe('vaultkey mcp setup cursor --write');

    const customTokenCmd = generateAgentSetupCommand('claude', 'http://localhost:8080', 'vk_token_abc');
    expect(customTokenCmd).toBe('vaultkey mcp setup claude --write --token=vk_token_abc');

    const customAllCmd = generateAgentSetupCommand('antigravity', 'https://vault.corp.internal', 'vk_token_xyz');
    expect(customAllCmd).toBe('vaultkey mcp setup antigravity --write --token=vk_token_xyz --server=https://vault.corp.internal');
  });
});

describe('Secrets Page Quick Copy Command generator', () => {
  test('formats run command with project and environment', () => {
    const runCmd = formatSecretsCommand('run', 'ecommerce-api', 'staging');
    expect(runCmd).toBe('vaultkey run --project=ecommerce-api --env=staging -- <cmd>');
  });

  test('formats pull command with project and environment', () => {
    const pullCmd = formatSecretsCommand('pull', 'backend', 'production');
    expect(pullCmd).toBe('vaultkey pull --project=backend --env=production');
  });

  test('quotes project and environment names containing spaces', () => {
    const runCmd = formatSecretsCommand('run', 'my project', 'staging env');
    expect(runCmd).toBe('vaultkey run --project="my project" --env="staging env" -- <cmd>');
  });
});
