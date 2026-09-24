import React from 'react';
import { Cpu, KeyRound, Lock, ScrollText } from 'lucide-react';

export const SecurityDocSection: React.FC = () => (
  <ul className="docs-security-list">
    <li className="docs-security-item">
      <KeyRound className="docs-security-icon" size={18} aria-hidden="true" />
      <div>
        <h3>Argon2id key derivation</h3>
        <p>Memory-hard Argon2id (time=3, memory=64MB, threads=4) with a unique 32-byte salt per team.</p>
      </div>
    </li>
    <li className="docs-security-item">
      <Cpu className="docs-security-icon" size={18} aria-hidden="true" />
      <div>
        <h3>In-memory key lock</h3>
        <p>Master key bytes reside in RAM and are cleared on lock or timeout: <code>{'for i := range key { key[i] = 0 }'}</code></p>
      </div>
    </li>
    <li className="docs-security-item">
      <Lock className="docs-security-icon" size={18} aria-hidden="true" />
      <div>
        <h3>AES-256-GCM encryption</h3>
        <p>Each secret is encrypted with a cryptographically secure, random 12-byte nonce.</p>
      </div>
    </li>
    <li className="docs-security-item">
      <ScrollText className="docs-security-icon" size={18} aria-hidden="true" />
      <div>
        <h3>HMAC audit ledger</h3>
        <p>Each audit action signs the previous entry in a tamper-evident HMAC-SHA256 chain: <code>HMAC(id + action + secretKey + prevHMAC)</code></p>
      </div>
    </li>
  </ul>
);
