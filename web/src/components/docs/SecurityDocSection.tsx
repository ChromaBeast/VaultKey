import React from 'react';
import { ArrowUp } from 'lucide-react';
import { DocsCallout } from './DocsCallout';
import { DocsCodeBlock } from './DocsCodeBlock';

interface SecurityDocProps {
  onCopy?: (id: string, code: string) => void;
  copiedSnippet?: string | null;
  onNavigateNext?: () => void;
}

export const SecurityDocSection: React.FC<SecurityDocProps> = ({ onCopy, copiedSnippet, onNavigateNext }) => {
  const zeroingCode = `// Explicitly zero out master key bytes from RAM on lock or timeout
for i := range masterKey {
    masterKey[i] = 0
}`;

  const hmacFormulaCode = `// HMAC signature forward hash chain formula:
// secretKey is the secret's NAME (metadata), not its secret value!
Signature = HMAC_SHA256(
    Key: SigningKey,
    Data: id + action + secretKey + prevHMAC
)`;

  return (
    <div className="docs-security-root">
      {/* 1. Summary */}
      <div id="security-overview" className="docs-subtopic-block">
        <p className="docs-lead-text">
          How VaultKey derives keys, encrypts values in memory, and verifies the tamper-evident audit chain.
        </p>

        {/* 2. When to use this */}
        <div id="security-when" className="docs-section-card mt-6">
          <h4 className="docs-card-heading">When to use this</h4>
          <ul className="docs-bullet-list">
            <li>Evaluating the cryptographic primitives and zero-knowledge model before deploying VaultKey for your team.</li>
            <li>Understanding how keys are derived, protected in memory, and validated against unauthorized ledger modifications.</li>
          </ul>
        </div>
      </div>

      {/* 3. Five Security Pillars */}
      <div id="sec-kdf" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">1. Key derivation (Argon2id)</h3>
        <p className="docs-lead-text">
          VaultKey derives team master keys using memory-hard Argon2id configured for high side-channel and ASIC resistance:
        </p>
        <ul className="docs-bullet-list">
          <li><strong>Time iterations:</strong> 3 passes</li>
          <li><strong>Memory cost:</strong> 64 MB (65,536 KiB)</li>
          <li><strong>Parallelism:</strong> 4 concurrent threads</li>
          <li><strong>Salt:</strong> Unique, cryptographically random 32-byte salt per team</li>
        </ul>
      </div>

      <div id="sec-ram" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">2. Master key in memory zeroing</h3>
        <p className="docs-lead-text">
          Master key bytes live only in RAM while the vault is unlocked. When the vault is locked manually or when the automatic inactivity timer (default 30m) expires, key bytes are immediately overwritten with zeroes:
        </p>
        {onCopy && (
          <DocsCodeBlock
            id="sec-zero-code"
            language="Go"
            code={zeroingCode}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        )}
      </div>

      <div id="sec-gcm" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">3. AES-256-GCM encryption</h3>
        <p className="docs-lead-text">
          Each secret is encrypted using authenticated AES-256-GCM with a fresh, cryptographically random 12-byte nonce for each secret and revision. Nonces are never reused across updates.
        </p>
      </div>

      <div id="sec-audit" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">4. Tamper-evident HMAC-SHA256 audit ledger</h3>
        <p className="docs-lead-text">
          Each audit log entry is signed with HMAC-SHA256 over the entry's ID, action, secret key name, and the previous entry's HMAC signature. If any past entry is deleted or modified in the database, the signature chain breaks, exposing tampering.
        </p>

        <DocsCallout type="info" title="Note on secretKey in the formula">
          In the formula below, <code className="docs-inline-code">secretKey</code> refers to the <strong>secret's name</strong> (such as <code className="docs-inline-code">DATABASE_URL</code>), not its plaintext value. Plaintext secret values are never signed or logged.
        </DocsCallout>

        {onCopy && (
          <DocsCodeBlock
            id="sec-hmac-code"
            language="Go"
            code={hmacFormulaCode}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        )}
      </div>

      <div id="sec-rbac" className="docs-subtopic-block mt-10">
        <h3 className="docs-h3">5. Role-based access control (RBAC)</h3>
        <p className="docs-lead-text">
          Access control is enforced at the team and workspace level:
        </p>
        <ul className="docs-bullet-list">
          <li><strong>Owner / Admin:</strong> Full access to manage team settings, billing, audit ledger, and machine keys.</li>
          <li><strong>Member / Writer:</strong> Allowed to read and update secrets in assigned projects.</li>
          <li><strong>Machine Key:</strong> Scoped programmatic token for CLI tools and AI coding agents.</li>
        </ul>
      </div>

      {/* Stack and Status Note */}
      <div className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">Architecture stack & status</h3>
        <p className="docs-text-muted text-sm">
          VaultKey is built with a Go (Fiber) backend, a React + Vite frontend, and SQLite storage for simple, single-binary self-hosting. VaultKey is in active early development.
        </p>
      </div>

      {/* Next: Back to top / CLI */}
      <div className="docs-next-box mt-12">
        <div className="docs-next-label">Back to start</div>
        <button
          type="button"
          className="docs-next-link"
          onClick={onNavigateNext}
        >
          <span>CLI tooling</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  );
};
