import React from 'react';
import { Bot, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { DocsCallout } from './DocsCallout';
import { DocsStepList } from './DocsStepList';
import { DocsCodeBlock } from './DocsCodeBlock';

interface OverviewDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

export const OverviewDocSection: React.FC<OverviewDocProps> = ({ onCopy, copiedSnippet }) => {
  const quickInstallCode = `# 1. Install VaultKey CLI
curl -fsSL https://vaultkey.sheershjaiswal.in/install.sh | sh

# 2. Authenticate
vaultkey login --server https://vaultkey.sheershjaiswal.in

# 3. Launch an agent with safe runtime secrets
vaultkey mcp`;

  const comparisonRows = [
    { feature: 'Primary Architecture', vaultkey: 'Single-binary Go + SQLite / Cloud', hashicorp: 'Go + Consul / Raft storage cluster', infisical: 'Node.js + PostgreSQL + Redis' },
    { feature: 'Model Context Protocol (MCP)', vaultkey: 'Native built-in server with zero-leak run_with_secrets', hashicorp: 'Third-party community bridges', infisical: 'Basic API wrappers' },
    { feature: 'RAM Key Zeroing', vaultkey: 'Explicit memory zeroing upon vault lock', hashicorp: 'OS page locking (mlock)', infisical: 'Node.js garbage collection dependent' },
    { feature: 'Key Derivation Function', vaultkey: 'Argon2id (time=3, mem=64MB, threads=4)', hashicorp: 'Shamir Secret Sharing + AES-GCM', hashicorpSub: 'Shamir', infisical: 'PBKDF2 / scrypt' },
    { feature: 'Audit Trail Verification', vaultkey: 'HMAC-SHA256 forward hash-chain ledger', hashicorp: 'File/Syslog audit devices', infisical: 'Standard database log table' },
    { feature: 'Deployment Footprint', vaultkey: '< 35MB single container / static binary', hashicorp: '~250MB per node + Consul', infisical: '~400MB + PG + Redis clusters' },
  ];

  return (
    <div className="docs-overview-section">
      <div id="overview-intro" className="docs-subtopic-block">
        <p className="docs-lead-text">
          VaultKey is a zero-knowledge secrets management platform and Model Context Protocol (MCP) server
          built for software teams and autonomous AI coding agents. It encrypts sensitive variables with
          AES-256-GCM, derives keys with memory-hard Argon2id, and enables AI agents to execute workloads
          without ever leaking production secrets into the LLM context window.
        </p>

        <DocsCallout type="tip" title="Built for modern developer & agent workflows">
          Looking to give Claude Code, Cursor, or Antigravity access to database migrations or deployment
          scripts? VaultKey's <code className="docs-inline-code">run_with_secrets</code> tool executes subcommands
          with runtime environment variables and returns only standard output to the model.
        </DocsCallout>
      </div>

      <div id="overview-quickstart" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Quickstart (30 seconds)</h3>
        <p className="docs-text-muted mb-4">
          Install the CLI, authenticate against your cloud workspace, and start injecting secrets.
        </p>

        <DocsStepList
          steps={[
            {
              number: 1,
              title: 'Install the CLI binary',
              description: 'Download the compiled single binary for macOS, Linux, or Windows.',
              content: (
                <DocsCodeBlock
                  id="overview-quickstart-code"
                  language="Bash"
                  code={quickInstallCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 2,
              title: 'Create and encrypt secrets in your vault',
              description: (
                <span>
                  Use the Web Dashboard or run <code className="docs-inline-code">vaultkey push --project=core --file=.env</code> to
                  safely upload environment variables.
                </span>
              ),
            },
            {
              number: 3,
              title: 'Run your app or connect AI coding agents',
              description: (
                <span>
                  Execute <code className="docs-inline-code">vaultkey run -- npm start</code> or add <code className="docs-inline-code">vaultkey mcp</code> to
                  your Claude or Cursor configuration.
                </span>
              ),
            },
          ]}
        />
      </div>

      <div id="overview-arch" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Zero-knowledge architecture</h3>
        <p className="docs-text-muted mb-6">
          Every secret is encrypted client-side or in-memory using team-derived master keys before being written to persistent storage.
        </p>

        <div className="docs-arch-grid">
          <div className="docs-arch-card">
            <div className="docs-arch-card-icon text-sky-400">
              <KeyRound size={20} />
            </div>
            <h4>Argon2id KDF</h4>
            <p>Passphrases are transformed into 256-bit keys using memory-hard Argon2id with 3 iterations, 64 MB of RAM, and 4 threads.</p>
          </div>

          <div className="docs-arch-card">
            <div className="docs-arch-card-icon text-emerald-400">
              <Lock size={20} />
            </div>
            <h4>AES-256-GCM</h4>
            <p>Values are encrypted with authenticated AES-256-GCM using unique, non-repeating 96-bit cryptographic nonces per revision.</p>
          </div>

          <div className="docs-arch-card">
            <div className="docs-arch-card-icon text-indigo-400">
              <Bot size={20} />
            </div>
            <h4>MCP Agent Boundary</h4>
            <p>Subshell isolation guarantees AI coding agents only receive exit codes and logs—preventing LLM training or context capture.</p>
          </div>

          <div className="docs-arch-card">
            <div className="docs-arch-card-icon text-purple-400">
              <ShieldCheck size={20} />
            </div>
            <h4>HMAC Audit Ledger</h4>
            <p>Every read, write, and rotation event generates an HMAC-SHA256 signature chained to the previous entry for tamper proofing.</p>
          </div>
        </div>
      </div>

      <div id="overview-compare" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Comparison with other secrets managers</h3>
        <p className="docs-text-muted mb-6">
          How VaultKey differs from enterprise tools like HashiCorp Vault and Infisical.
        </p>

        <div className="docs-table-wrap" role="region" aria-label="Comparison Table" tabIndex={0}>
          <table className="docs-compare-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '25%' }}>Capability</th>
                <th scope="col" style={{ width: '25%' }} className="text-sky-400 font-bold">VaultKey</th>
                <th scope="col" style={{ width: '25%' }}>HashiCorp Vault</th>
                <th scope="col" style={{ width: '25%' }}>Infisical</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td className="font-semibold text-white">{row.feature}</td>
                  <td className="docs-compare-highlight">{row.vaultkey}</td>
                  <td className="text-muted-foreground">{row.hashicorp}</td>
                  <td className="text-muted-foreground">{row.infisical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
