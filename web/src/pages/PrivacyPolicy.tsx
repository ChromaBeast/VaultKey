import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--vk-bg)', color: 'var(--vk-text)', padding: '40px 20px' }}>
      <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: 'var(--vk-accent)' }}>VaultKey Privacy & Compliance</h1>
          <Link to="/" style={{ color: 'var(--vk-text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>&larr; Back to Home</Link>
        </div>

        <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Last Updated: July 2026 | Zero-Trust Architecture Baseline
        </p>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--vk-text)', borderBottom: '1px solid var(--vk-border)', paddingBottom: '8px' }}>
            1. Zero-Trust In-Memory Security Model
          </h2>
          <p style={{ lineHeight: 1.6, color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            VaultKey is engineered under a strict zero-trust principle: secrets never exist in plaintext on disk. Your master key is derived strictly in RAM via memory-hard Argon2id and is explicitly zeroed out when your vault locks.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--vk-text)', borderBottom: '1px solid var(--vk-border)', paddingBottom: '8px' }}>
            2. Data Residency & Local Storage
          </h2>
          <p style={{ lineHeight: 1.6, color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            When self-hosted, all encrypted database records reside exclusively within your specified SQLite database file (<code className="code-font" style={{ background: 'var(--vk-surface-2)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', color: 'var(--vk-accent)' }}>vaultkey.db</code>) or Docker volume container. VaultKey does not transmit your vault contents or derived keys to third-party telemetry servers.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--vk-text)', borderBottom: '1px solid var(--vk-border)', paddingBottom: '8px' }}>
            3. Audit Logging & HMAC Ledger
          </h2>
          <p style={{ lineHeight: 1.6, color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            To satisfy SOC2 and regulatory audit requirements, VaultKey maintains a tamper-evident HMAC-SHA256 chained ledger recording vault access events (unlock, secret creation, key retrieval). Audit logs capture timestamp, action name, actor ID, and IP address for incident response.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--vk-text)', borderBottom: '1px solid var(--vk-border)', paddingBottom: '8px' }}>
            4. Open-Source & License Compliance
          </h2>
          <p style={{ lineHeight: 1.6, color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            VaultKey core dependencies are open-source and governed under OSI-compliant permissive licenses (MIT, BSD-3-Clause). All cryptographic implementations leverage standard audited Go standard library modules.
          </p>
        </section>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--vk-border)', fontSize: '0.75rem', color: 'var(--vk-text-muted)', textAlign: 'center' }}>
          VaultKey Enterprise Secrets Manager • Security Baseline Compliant
        </div>
      </div>
    </div>
  );
};
