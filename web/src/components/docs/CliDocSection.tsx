import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsStepList } from './DocsStepList';

interface CliDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
  onNavigateNext?: () => void;
}

export const CliDocSection: React.FC<CliDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const authCode = `# Set your VaultKey server URL and authentication token
export VAULTKEY_SERVER="https://your-vaultkey-server.com"
export VAULTKEY_TOKEN="vk_your_token_here"`;

  const pullCode = `# Pull environment variables into a local .env file
vaultkey pull --project=backend --env=production`;

  const pushCode = `# Push variables from a local file up to your VaultKey server
vaultkey push --project=frontend --file=.env.local`;

  const runCode = `# Inject secrets directly into a child process without writing to disk
vaultkey run --project=backend -- npm start`;

  const keysCode = `# Create a dedicated machine key with a label for an agent or CI tool
vaultkey keys create --label "ci-runner"
# Output:
# Token: vk_mach_8f92b7c104e67d2a901e4a52`;

  return (
    <div className="docs-cli-root">
      {/* 1. Summary */}
      <div id="cli-overview" className="docs-subtopic-block">
        <p className="docs-lead-text">
          Authenticate, sync local variables, and inject secrets into a child process.
        </p>

        {/* 2. When to use this */}
        <div id="cli-when" className="docs-section-card mt-6">
          <h4 className="docs-card-heading">When to use this</h4>
          <ul className="docs-bullet-list">
            <li>Pulling environment variables into a local <code className="docs-inline-code">.env</code> file for local development.</li>
            <li>Pushing variables from a local file up to your VaultKey server when initializing or updating secrets.</li>
            <li>Injecting secrets into a child process without writing them to disk in staging, production, or CI/CD pipelines.</li>
            <li>Generating dedicated machine keys with scoped access for automated tools, daemons, or CI workers.</li>
          </ul>
        </div>
      </div>

      {/* 3. Authentication & Prerequisites */}
      <div id="cli-auth" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Authentication</h3>
        <p className="docs-lead-text">
          Every CLI operation communicates with your VaultKey server over HTTPS. Authentication is handled by passing a token in the <code className="docs-inline-code">VAULTKEY_TOKEN</code> environment variable:
        </p>

        <ul className="docs-bullet-list mb-6">
          <li><strong>Admin token</strong> (<code className="docs-inline-code">vk_admin....</code>): Issued to organization owners and administrators during signup or login. Used for managing projects, members, and creating machine keys.</li>
          <li><strong>Machine key</strong> (<code className="docs-inline-code">vk_....</code>): Created using <code className="docs-inline-code">vaultkey keys create --label "&lt;name&gt;"</code>. Recommended for CI/CD runners, deployment scripts, and AI agents so tokens can be revoked independently.</li>
        </ul>

        <DocsCodeBlock
          id="cli-auth-snippet"
          language="Bash"
          code={authCode}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
      </div>

      {/* 4. Steps */}
      <div id="cli-steps" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Steps</h3>

        <DocsStepList
          steps={[
            {
              number: 1,
              title: 'Pull variables into a local .env file',
              description: 'Retrieve decrypted key-value pairs for a specific project and environment into a local file:',
              content: (
                <DocsCodeBlock
                  id="cli-pull-snippet"
                  language="Bash"
                  code={pullCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 2,
              title: 'Push variables from a local file to your VaultKey server',
              description: 'Encrypt and upload environment variables from an existing local file to the specified project:',
              content: (
                <DocsCodeBlock
                  id="cli-push-snippet"
                  language="Bash"
                  code={pushCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 3,
              title: 'Inject secrets into a child process without writing them to disk',
              description: 'Pass secrets directly into process memory for the duration of the child command:',
              content: (
                <DocsCodeBlock
                  id="cli-run-snippet"
                  language="Bash"
                  code={runCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
            {
              number: 4,
              title: 'Create a dedicated machine key',
              description: 'Generate a dedicated token for a tool or agent:',
              content: (
                <DocsCodeBlock
                  id="cli-keys-snippet"
                  language="Bash"
                  code={keysCode}
                  copiedSnippet={copiedSnippet}
                  onCopy={onCopy}
                />
              ),
            },
          ]}
        />
      </div>

      {/* 5. Verify */}
      <div id="cli-verify" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">Verify</h3>
        <p className="docs-lead-text">
          Verify that <code className="docs-inline-code">vaultkey run</code> injects secrets into your command by printing the injected environment:
        </p>
        <DocsCodeBlock
          id="cli-verify-snippet"
          language="Bash"
          code={`vaultkey run --project=backend -- env | grep -E "DATABASE_URL|NODE_ENV"`}
          copiedSnippet={copiedSnippet}
          onCopy={onCopy}
        />
        <p className="docs-text-muted mt-2 text-sm">
          Expected output: The variables appear in stdout for the running command, while no file is created in your working directory.
        </p>
      </div>

      {/* 6. Reference Table */}
      <div id="cli-ref" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Reference</h3>
        <div className="docs-table-wrap" role="region" aria-label="CLI commands reference" tabIndex={0}>
          <table className="docs-compare-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '30%' }}>Command</th>
                <th scope="col" style={{ width: '40%' }}>Description</th>
                <th scope="col" style={{ width: '30%' }}>Flags</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="docs-inline-code">vaultkey pull</code></td>
                <td>Pull variables into a local <code className="docs-inline-code">.env</code> file</td>
                <td><code className="text-muted-foreground">--project=&lt;name&gt; --env=&lt;env&gt;</code></td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">vaultkey push</code></td>
                <td>Push variables from a local file to your VaultKey server</td>
                <td><code className="text-muted-foreground">--project=&lt;name&gt; --file=&lt;path&gt;</code></td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">vaultkey run</code></td>
                <td>Inject secrets into a child process without writing them to disk</td>
                <td><code className="text-muted-foreground">--project=&lt;name&gt; -- &lt;command&gt;</code></td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">vaultkey keys create</code></td>
                <td>Create a dedicated machine key for a tool or agent</td>
                <td><code className="text-muted-foreground">--label="&lt;name&gt;"</code></td>
              </tr>
              <tr>
                <td><code className="docs-inline-code">vaultkey mcp</code></td>
                <td>Start the Model Context Protocol server for AI coding agents</td>
                <td><code className="text-muted-foreground">none (uses env vars)</code></td>
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
          <span>SDKs (Node.js & Python)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
