import React from 'react';

export const SecurityDocSection: React.FC = () => {
  return (
    <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Zero-Trust Threat Model Architecture</h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e1', fontSize: '0.9rem' }}>
        <li>🔒 <strong>Argon2id Key Derivation</strong>: Memory-hard Argon2id (time=3, memory=64MB, threads=4) with a unique 32-byte salt per team.</li>
        <li>RAM <strong>Strict In-Memory Memory Lock</strong>: Master key bytes reside only in RAM. On lock/timeout, key bytes are zeroed out (<code>for i := range key &#123; key[i] = 0 &#125;</code>).</li>
        <li>🛡️ <strong>AES-256-GCM Encryption</strong>: Per-item encryption with cryptographically secure 12-byte random nonces.</li>
        <li>📜 <strong>Tamper-Evident HMAC Audit Ledger</strong>: Every audit action signs an immutable HMAC-SHA256 signature chain (`HMAC(id + action + secretKey + prevHMAC)`).</li>
      </ul>
    </div>
  );
};
