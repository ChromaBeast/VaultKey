export interface DocTab {
  id: string;
  label: string;
  badge?: string;
}

export const DOC_TABS: DocTab[] = [
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'cli', label: 'CLI' },
  { id: 'sdk', label: 'SDKs' },
  { id: 'mcp', label: 'MCP / AI agents' },
  { id: 'api', label: 'REST API' },
  { id: 'security', label: 'Security' },
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
    label: 'Documentation',
    items: [
      { id: 'quickstart', label: '1. Quickstart', sectionId: 'quickstart' },
      { id: 'cli', label: '2. CLI', sectionId: 'cli' },
      { id: 'sdk', label: '3. SDKs', sectionId: 'sdk' },
      { id: 'mcp', label: '4. MCP / AI agents', sectionId: 'mcp' },
      { id: 'api', label: '5. REST API', sectionId: 'api' },
      { id: 'security', label: '6. Security', sectionId: 'security' },
    ],
  },
];

export interface SearchDocItem {
  id: string;
  sectionId: string;
  category: 'QUICKSTART' | 'CLI' | 'SDK' | 'MCP' | 'API' | 'SECURITY';
  title: string;
  description: string;
  keywords: string[];
}

export const DOC_SEARCH_INDEX: SearchDocItem[] = [
  {
    id: 'quickstart',
    sectionId: 'quickstart',
    category: 'QUICKSTART',
    title: 'Quickstart',
    description: 'Set server and token, pull secrets or run your app directly in 3 steps',
    keywords: ['quickstart', 'start', 'pull', 'run', 'token', 'server', 'setup'],
  },
  {
    id: 'cli',
    sectionId: 'cli',
    category: 'CLI',
    title: 'CLI',
    description: 'Authenticate, sync local files, inject secrets into processes, or manage keys',
    keywords: ['cli', 'pull', 'push', 'run', 'keys create', 'mcp'],
  },
  {
    id: 'sdk',
    sectionId: 'sdk',
    category: 'SDK',
    title: 'SDKs',
    description: 'Inject secrets into Node.js (vaultkey-js) and Python (vaultkey) at runtime',
    keywords: ['sdk', 'node', 'typescript', 'python', 'vaultkey-js', 'inject', 'get'],
  },
  {
    id: 'mcp',
    sectionId: 'mcp',
    category: 'MCP',
    title: 'MCP / AI agents',
    description: 'Model Context Protocol server for Claude Code, Cursor, Codex, Gemini, Antigravity',
    keywords: ['mcp', 'agents', 'claude', 'cursor', 'codex', 'gemini', 'run_with_secrets', 'tools'],
  },
  {
    id: 'api',
    sectionId: 'api',
    category: 'API',
    title: 'REST API',
    description: 'Interact directly with your VaultKey server over HTTP',
    keywords: ['api', 'rest', 'endpoints', 'curl', 'auth', 'secrets', 'values', 'shares'],
  },
  {
    id: 'security',
    sectionId: 'security',
    category: 'SECURITY',
    title: 'Security',
    description: 'AES-256-GCM encryption, Argon2id key derivation, RBAC, HMAC-chained audit log',
    keywords: ['security', 'argon2id', 'aes-256-gcm', 'rbac', 'hmac', 'audit log'],
  },
];

export { VAULTKEY_DOCS_MARKDOWN } from './docsMarkdown';
