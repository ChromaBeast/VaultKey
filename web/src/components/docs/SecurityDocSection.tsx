import React from 'react';
import { DocsCallout } from './DocsCallout';
import { DocsCodeBlock } from './DocsCodeBlock';

interface SecurityDocProps {
  onCopy?: (id: string, code: string) => void;
  copiedSnippet?: string | null;
}

export const SecurityDocSection: React.FC<SecurityDocProps> = ({ onCopy, copiedSnippet }) => {
  const zeroingCode = `// internal/crypto/zero.go
// Explicitly zero out sensitive key memory when locking the vault
func ZeroBytes(b []byte) {
    for i := range b {
        b[i] = 0
    }
    runtime.KeepAlive(b)
}`;

  const hmacFormulaCode = `// Audit ledger hash chain verification:
// Entry N depends on the HMAC signature of Entry N-1
Signature = HMAC_SHA256(
    Key: SigningKey,
    Data: EntryID + Timestamp + Action + ActorID + TargetID + PrevSignature
)`;

  return (
    <div className="docs-security-root">
      <div id="sec-intro" className="docs-subtopic-block">
        <p className="docs-lead-text">
          VaultKey is designed on a zero-knowledge threat model: the server stores only ciphertext
          and cryptographic salts. At no point does unencrypted secret material persist in databases,
          logs, or system disks.
        </p>

        <DocsCallout type="security" title="Cryptographic primitives">
          All algorithms adhere to NIST recommendations: Argon2id for key derivation, AES-256-GCM
          for authenticated symmetric encryption, and HMAC-SHA256 for forward-chained audit ledgers.
        </DocsCallout>
      </div>

      <div id="sec-kdf" className="docs-subtopic-block mt-12">
        <h3 className="docs-h3">1. Argon2id Key Derivation</h3>
        <p className="docs-text-muted mb-4">
          When an organization admin enters their master passphrase, VaultKey derives the team's
          256-bit encryption key using memory-hard Argon2id configured to defeat GPU and ASIC attacks:
        </p>

        <div className="docs-crypto-params-grid">
          <div className="docs-crypto-param-card">
            <span className="docs-crypto-param-name">Time Iterations</span>
            <span className="docs-crypto-param-val">3</span>
            <span className="docs-crypto-param-desc">Sequential passes over memory</span>
          </div>
          <div className="docs-crypto-param-card">
            <span className="docs-crypto-param-name">Memory Cost</span>
            <span className="docs-crypto-param-val">64 MB</span>
            <span className="docs-crypto-param-desc">65,536 KiB dedicated buffer</span>
          </div>
          <div className="docs-crypto-param-card">
            <span className="docs-crypto-param-name">Parallelism</span>
            <span className="docs-crypto-param-val">4</span>
            <span className="docs-crypto-param-desc">Concurrent worker threads</span>
          </div>
          <div className="docs-crypto-param-card">
            <span className="docs-crypto-param-name">Salt Length</span>
            <span className="docs-crypto-param-val">32 bytes</span>
            <span className="docs-crypto-param-desc">Cryptographically random per org</span>
          </div>
        </div>
      </div>

      <div id="sec-gcm" className="docs-subtopic-block mt-14">
        <h3 className="docs-h3">2. AES-256-GCM Authenticated Encryption</h3>
        <p className="docs-text-muted mb-4">
          Every secret revision is encrypted using standard AES-GCM with a 256-bit master key and an
          independent 96-bit (12-byte) initialization vector (nonce) generated via <code className="docs-inline-code">crypto/rand</code>.
          GCM provides both confidentiality and tamper detection via a 16-byte authentication tag.
        </p>
      </div>

      <div id="sec-zero" className="docs-subtopic-block mt-14">
        <h3 className="docs-h3">3. In-Memory RAM Key Zeroing</h3>
        <p className="docs-text-muted mb-4">
          When an operator locks the vault or the automatic session timeout fires (default 30m),
          master keys are not merely left for garbage collection—they are explicitly overwritten with zeroes in memory:
        </p>

        {onCopy && (
          <DocsCodeBlock
            id="sec-zero-snippet"
            language="Go"
            code={zeroingCode}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        )}
      </div>

      <div id="sec-audit" className="docs-subtopic-block mt-14">
        <h3 className="docs-h3">4. Tamper-Evident HMAC Audit Chaining</h3>
        <p className="docs-text-muted mb-4">
          The VaultKey audit trail forms an immutable forward hash chain. Any attempt to modify,
          delete, or reorder database records breaks the cryptographic signature of every subsequent
          entry, immediately exposing tampering in the Web UI:
        </p>

        {onCopy && (
          <DocsCodeBlock
            id="sec-hmac-snippet"
            language="Go"
            code={hmacFormulaCode}
            copiedSnippet={copiedSnippet || null}
            onCopy={onCopy}
          />
        )}
      </div>
    </div>
  );
};
