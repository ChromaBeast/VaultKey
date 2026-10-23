export interface DocTab {
  id: string;
  label: string;
  badge?: string;
}

export const DOC_TABS: DocTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'mcp', label: 'MCP / AI Agents', badge: 'New' },
  { id: 'cli', label: 'CLI Tooling' },
  { id: 'sdk', label: 'SDKs' },
  { id: 'api', label: 'REST API' },
  { id: 'security', label: 'Security Model' },
  { id: 'architecture', label: 'Architecture' },
];

export interface NavGroup {
  label: string;
  items: {
    id: string;
    label: string;
    sectionId: string;
    badge?: string;
    external?: boolean;
    href?: string;
  }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Get started',
    items: [
      { id: 'overview-intro', label: 'Overview', sectionId: 'overview' },
      { id: 'overview-quickstart', label: 'Quickstart', sectionId: 'overview' },
      { id: 'overview-arch', label: 'Architecture', sectionId: 'overview' },
      { id: 'overview-compare', label: 'Comparison with Vault & Infisical', sectionId: 'overview' },
      { id: 'overview-changelog', label: 'Changelog', sectionId: 'overview', external: true, href: 'https://github.com/ChromaBeast/VaultKey/releases' },
    ],
  },
  {
    label: 'MCP & AI Agents',
    items: [
      { id: 'mcp-intro', label: 'Overview & Protocol', sectionId: 'mcp', badge: 'New' },
      { id: 'mcp-safe-exec', label: 'Zero-Leak run_with_secrets', sectionId: 'mcp' },
      { id: 'mcp-claude', label: 'Claude Code & Desktop', sectionId: 'mcp' },
      { id: 'mcp-cursor', label: 'Cursor IDE Configuration', sectionId: 'mcp' },
      { id: 'mcp-tools', label: 'Tool Reference & Schemas', sectionId: 'mcp' },
    ],
  },
  {
    label: 'CLI Tooling',
    items: [
      { id: 'cli-intro', label: 'Command-Line Interface', sectionId: 'cli' },
      { id: 'cli-install', label: 'Installation', sectionId: 'cli' },
      { id: 'cli-auth', label: 'Authentication', sectionId: 'cli' },
      { id: 'cli-sync', label: 'Local Sync (pull / push)', sectionId: 'cli' },
      { id: 'cli-run', label: 'Child Process Injection (run)', sectionId: 'cli' },
    ],
  },
  {
    label: 'SDKs',
    items: [
      { id: 'sdk-ts', label: 'TypeScript / Node.js', sectionId: 'sdk' },
      { id: 'sdk-py', label: 'Python', sectionId: 'sdk' },
      { id: 'sdk-go', label: 'Go SDK', sectionId: 'sdk' },
    ],
  },
  {
    label: 'REST API',
    items: [
      { id: 'api-endpoints', label: 'Endpoints & Headers', sectionId: 'api' },
      { id: 'api-auth', label: 'Bearer Authentication', sectionId: 'api' },
      { id: 'api-shares', label: 'One-Time Secret Links', sectionId: 'api' },
    ],
  },
  {
    label: 'Security model',
    items: [
      { id: 'sec-kdf', label: 'Argon2id Key Derivation', sectionId: 'security' },
      { id: 'sec-gcm', label: 'AES-256-GCM Nonce Derivation', sectionId: 'security' },
      { id: 'sec-zero', label: 'In-Memory RAM Zeroing', sectionId: 'security' },
      { id: 'sec-audit', label: 'HMAC Tamper-Evident Ledger', sectionId: 'security' },
    ],
  },
];

export interface SearchDocItem {
  id: string;
  sectionId: string;
  category: 'CLI' | 'SDK' | 'MCP' | 'API' | 'SECURITY' | 'OVERVIEW';
  title: string;
  description: string;
  keywords: string[];
}

export const DOC_SEARCH_INDEX: SearchDocItem[] = [
  {
    id: 'cli-install',
    sectionId: 'cli',
    category: 'CLI',
    title: 'CLI Installation & Setup',
    description: 'Install vaultkey binary on macOS, Linux, or via Go installer',
    keywords: ['install', 'curl', 'binary', 'setup', 'brew'],
  },
  {
    id: 'cli-pull',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey pull',
    description: 'Pull encrypted secrets into local environment files',
    keywords: ['pull', 'env', 'download', 'decrypt'],
  },
  {
    id: 'cli-push',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey push',
    description: 'Upload and encrypt local .env files to VaultKey Cloud',
    keywords: ['push', 'upload', 'sync', 'secrets'],
  },
  {
    id: 'cli-run',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey run',
    description: 'Inject secrets into child processes in RAM without touching disk',
    keywords: ['run', 'inject', 'exec', 'process', 'memory'],
  },
  {
    id: 'mcp-overview',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'Model Context Protocol (MCP) Integration',
    description: 'Connect AI coding agents (Claude Code, Cursor, Antigravity) safely',
    keywords: ['mcp', 'agent', 'claude', 'cursor', 'antigravity', 'llm', 'ai'],
  },
  {
    id: 'mcp-run-with-secrets',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'run_with_secrets MCP Tool',
    description: 'Execute agent shell commands with injected secrets with zero LLM context leakage',
    keywords: ['run_with_secrets', 'tool', 'safe', 'leak', 'zero-knowledge', 'exec'],
  },
  {
    id: 'mcp-claude-config',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'Claude Code & Claude Desktop MCP Configuration',
    description: 'claude_desktop_config.json configuration for VaultKey',
    keywords: ['claude', 'anthropic', 'desktop', 'config', 'mcpServers'],
  },
  {
    id: 'mcp-cursor-config',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'Cursor IDE MCP Configuration',
    description: '.cursor/mcp.json setup for Cursor AI IDE',
    keywords: ['cursor', 'mcp.json', 'ide', 'editor'],
  },
  {
    id: 'sdk-ts',
    sectionId: 'sdk',
    category: 'SDK',
    title: 'TypeScript / Node.js SDK',
    description: 'vaultkey-js client for Next.js, Express, and Node microservices',
    keywords: ['typescript', 'node', 'npm', 'javascript', 'vaultkey-js'],
  },
  {
    id: 'sdk-python',
    sectionId: 'sdk',
    category: 'SDK',
    title: 'Python SDK',
    description: 'vaultkey python package for FastAPI, Django, and ML pipelines',
    keywords: ['python', 'pip', 'django', 'fastapi', 'py'],
  },
  {
    id: 'api-auth',
    sectionId: 'api',
    category: 'API',
    title: 'REST API Authentication',
    description: 'Sign up, login, and Bearer token / machine key usage',
    keywords: ['rest', 'api', 'auth', 'bearer', 'login', 'token'],
  },
  {
    id: 'api-secrets',
    sectionId: 'api',
    category: 'API',
    title: 'REST Secrets Endpoints',
    description: 'POST /v1/secrets and GET /v1/secrets/values endpoints',
    keywords: ['endpoints', 'post', 'get', 'v1/secrets'],
  },
  {
    id: 'sec-argon2',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'Argon2id Key Derivation',
    description: 'Memory-hard KDF (time=3, memory=64MB, threads=4) with per-team salt',
    keywords: ['argon2', 'argon2id', 'kdf', 'derivation', 'salt', 'crypto'],
  },
  {
    id: 'sec-zeroing',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'In-Memory RAM Zeroing',
    description: 'Immediate wiping of plaintext master keys on lock or timeout',
    keywords: ['ram', 'zeroing', 'memory', 'wipe', 'lock'],
  },
  {
    id: 'sec-hmac',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'Tamper-Evident HMAC Audit Chain',
    description: 'Cryptographic ledger signed with SHA256 forward-chaining',
    keywords: ['hmac', 'audit', 'chain', 'ledger', 'tamper', 'sha256'],
  },
];
