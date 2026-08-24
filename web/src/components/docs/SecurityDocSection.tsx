import React from 'react';
import { Cpu, KeyRound, Lock, ScrollText } from 'lucide-react';

export const SecurityDocSection: React.FC = () => {
  return (
    <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Zero-Trust Threat Model Architecture</h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e1', fontSize: '0.9rem' }}>
        <li style={{ display: 'flex', gap: '10px' }}>
          <KeyRound size={16} color="#c084fc" style={{ flexShrink: 0, marginTop: '3px' }} />
          <span><strong>Argon2id Key Derivation</strong>: Memory-hard Argon2id (time=3, memory=64MB, threads=4) with a unique 32-byte salt per team.</span>
        </li>
        <li style={{ display: 'flex', gap: '10px' }}>
          <Cpu size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '3px' }} />
          <span><strong>Strict In-Memory Key Lock</strong>: Master key bytes reside only in RAM. On lock/timeout, key bytes are zeroed out (<code className="code-font" style={{ color: '#818cf8' }}>for i := range key &#123; key[i] = 0 &#125;</code>).</span>
        </li>
        <li style={{ display: 'flex', gap: '10px' }}>
          <Lock size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '3px' }} />
          <span><strong>AES-256-GCM Encryption</strong>: Per-item encryption with cryptographically secure 12-byte random nonces.</span>
        </li>
        <li style={{ display: 'flex', gap: '10px' }}>
          <ScrollText size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '3px' }} />
          <span><strong>Tamper-Evident HMAC Audit Ledger</strong>: Every audit action signs an immutable HMAC-SHA256 signature chain (<code className="code-font" style={{ color: '#818cf8' }}>HMAC(id + action + secretKey + prevHMAC)</code>).</span>
        </li>
      </ul>
    </div>
  );
};
