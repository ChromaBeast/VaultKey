export interface DocTab {
  id: string;
  label: string;
  badge?: string;
}

export const DOC_TABS: DocTab[] = [
  { id: 'cli', label: 'CLI tooling' },
  { id: 'sdk', label: 'SDKs' },
  { id: 'mcp', label: 'MCP / AI agents', badge: 'New' },
  { id: 'api', label: 'REST API' },
  { id: 'security', label: 'Security model' },
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
    label: '1. CLI tooling',
    items: [
      { id: 'cli-overview', label: 'Summary', sectionId: 'cli' },
      { id: 'cli-when', label: 'When to use this', sectionId: 'cli' },
      { id: 'cli-auth', label: 'Authentication & tokens', sectionId: 'cli' },
      { id: 'cli-steps', label: 'Workflow & steps', sectionId: 'cli' },
      { id: 'cli-verify', label: 'Verify', sectionId: 'cli' },
      { id: 'cli-ref', label: 'Command reference', sectionId: 'cli' },
    ],
  },
  {
    label: '2. SDKs',
    items: [
      { id: 'sdk-overview', label: 'Summary', sectionId: 'sdk' },
      { id: 'sdk-when', label: 'When to use this', sectionId: 'sdk' },
      { id: 'sdk-node', label: 'Node.js / TypeScript', sectionId: 'sdk' },
      { id: 'sdk-python', label: 'Python', sectionId: 'sdk' },
      { id: 'sdk-verify', label: 'Verify', sectionId: 'sdk' },
      { id: 'sdk-ref', label: 'Reference & methods', sectionId: 'sdk' },
    ],
  },
  {
    label: '3. MCP / AI agents',
    items: [
      { id: 'mcp-overview', label: 'Summary', sectionId: 'mcp', badge: 'New' },
      { id: 'mcp-when', label: 'When to use this', sectionId: 'mcp' },
      { id: 'mcp-why', label: 'Why run_with_secrets', sectionId: 'mcp' },
      { id: 'mcp-steps', label: 'Agent configuration', sectionId: 'mcp' },
      { id: 'mcp-tools', label: 'Tool safety & reference', sectionId: 'mcp' },
      { id: 'mcp-verify', label: 'Verify', sectionId: 'mcp' },
    ],
  },
  {
    label: '4. REST API',
    items: [
      { id: 'api-overview', label: 'Summary', sectionId: 'api' },
      { id: 'api-when', label: 'When to use this', sectionId: 'api' },
      { id: 'api-auth', label: 'Authentication', sectionId: 'api' },
      { id: 'api-endpoints', label: 'Endpoints table', sectionId: 'api' },
      { id: 'api-verify', label: 'Verify with cURL', sectionId: 'api' },
    ],
  },
  {
    label: '5. Security model',
    items: [
      { id: 'security-overview', label: 'Summary', sectionId: 'security' },
      { id: 'sec-kdf', label: 'Argon2id key derivation', sectionId: 'security' },
      { id: 'sec-ram', label: 'Master key in memory', sectionId: 'security' },
      { id: 'sec-gcm', label: 'AES-256-GCM encryption', sectionId: 'security' },
      { id: 'sec-audit', label: 'HMAC-SHA256 audit ledger', sectionId: 'security' },
      { id: 'sec-rbac', label: 'Role-based access (RBAC)', sectionId: 'security' },
    ],
  },
];

export interface SearchDocItem {
  id: string;
  sectionId: string;
  category: 'CLI' | 'SDK' | 'MCP' | 'API' | 'SECURITY';
  title: string;
  description: string;
  keywords: string[];
}

export const DOC_SEARCH_INDEX: SearchDocItem[] = [
  {
    id: 'cli',
    sectionId: 'cli',
    category: 'CLI',
    title: 'CLI tooling',
    description: 'Authenticate, pull, push, and inject secrets into child processes',
    keywords: ['cli', 'pull', 'push', 'run', 'keys create', 'install', 'token'],
  },
  {
    id: 'cli-pull',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey pull',
    description: 'Pull variables into a local .env file',
    keywords: ['pull', 'env', 'download', 'decrypt'],
  },
  {
    id: 'cli-push',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey push',
    description: 'Push variables from a local file to your VaultKey server',
    keywords: ['push', 'upload', 'sync', 'secrets'],
  },
  {
    id: 'cli-run',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey run',
    description: 'Inject secrets into a child process without writing them to disk',
    keywords: ['run', 'inject', 'exec', 'child process', 'memory'],
  },
  {
    id: 'cli-keys',
    sectionId: 'cli',
    category: 'CLI',
    title: 'vaultkey keys create',
    description: 'Create a dedicated machine key for a tool or agent',
    keywords: ['keys', 'machine key', 'create', 'token', 'label'],
  },
  {
    id: 'sdk',
    sectionId: 'sdk',
    category: 'SDK',
    title: 'SDKs',
    description: 'Read secrets from Node.js and Python services at runtime',
    keywords: ['sdk', 'node', 'python', 'typescript', 'vaultkey-js'],
  },
  {
    id: 'sdk-node',
    sectionId: 'sdk',
    category: 'SDK',
    title: 'Node.js / TypeScript SDK (vaultkey-js)',
    description: 'Class Vaultkey with inject(project, env) and get(name) methods',
    keywords: ['typescript', 'node', 'vaultkey-js', 'inject', 'get'],
  },
  {
    id: 'sdk-python',
    sectionId: 'sdk',
    category: 'SDK',
    title: 'Python SDK (vaultkey)',
    description: 'Class Vaultkey with inject(project=..., env=...) method',
    keywords: ['python', 'vaultkey', 'inject', 'fastapi', 'django'],
  },
  {
    id: 'mcp',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'MCP / AI agents (New)',
    description: 'Give AI coding agents structured access without leaking values into LLM context',
    keywords: ['mcp', 'agent', 'claude', 'cursor', 'antigravity', 'run_with_secrets'],
  },
  {
    id: 'mcp-run',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'run_with_secrets MCP Tool',
    description: 'Runs a shell command with secrets as env vars; only stdout/stderr return to agent',
    keywords: ['run_with_secrets', 'safe', 'recommended', 'stdout', 'leak'],
  },
  {
    id: 'mcp-tools',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'MCP Tools Table',
    description: 'list_projects, list_secret_names, check_missing_secrets, get_secret_value, set_secret_value, run_with_secrets',
    keywords: ['tools', 'list_projects', 'list_secret_names', 'check_missing_secrets', 'get_secret_value', 'set_secret_value'],
  },
  {
    id: 'api',
    sectionId: 'api',
    category: 'API',
    title: 'REST API',
    description: 'Core endpoints for authentication, encrypted values, and one-time sharing',
    keywords: ['rest', 'api', 'endpoints', 'auth', 'signup', 'login', 'secrets', 'shares'],
  },
  {
    id: 'sec-kdf',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'Key derivation (Argon2id)',
    description: 'Argon2id with time=3, memory=64 MB, threads=4, unique 32-byte salt per team',
    keywords: ['argon2id', 'kdf', 'derivation', 'salt', 'memory', 'threads'],
  },
  {
    id: 'sec-ram',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'Master key in memory zeroing',
    description: 'Master key bytes live in RAM and are zeroed on lock or timeout',
    keywords: ['memory', 'ram', 'zeroed', 'lock', 'timeout'],
  },
  {
    id: 'sec-gcm',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'AES-256-GCM encryption',
    description: 'AES-256-GCM with a random 12-byte nonce for each secret',
    keywords: ['aes', 'aes-256-gcm', 'nonce', 'encryption'],
  },
  {
    id: 'sec-audit',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'HMAC-SHA256 audit ledger',
    description: 'Signed with HMAC-SHA256 over id, action, secret key name, and prevHMAC',
    keywords: ['hmac', 'audit', 'ledger', 'signature', 'tamper'],
  },
  {
    id: 'sec-rbac',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'Role-based access control (RBAC)',
    description: 'Role-based access control for team members and machine keys',
    keywords: ['rbac', 'roles', 'admin', 'permissions'],
  },
];
