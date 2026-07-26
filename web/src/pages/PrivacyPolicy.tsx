import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0e14', color: '#e2e8f0', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#131822', padding: '32px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#38bdf8' }}>🔑 VaultKey Privacy & Compliance Policy</h1>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</Link>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
          Last Updated: July 2026 | Zero-Trust Architecture Baseline
        </p>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#f8fafc', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>1. Zero-Trust In-Memory Security Model</h2>
          <p style={{ lineHeight: 1.6, color: '#cbd5e1' }}>
            VaultKey is engineered under a strict zero-trust principle: secrets never exist in plaintext on disk. Your master key is derived strictly in RAM via memory-hard Argon2id and is explicitly zeroed out when your vault locks.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#f8fafc', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>2. Data Residency & Local Storage</h2>
          <p style={{ lineHeight: 1.6, color: '#cbd5e1' }}>
            When self-hosted, all encrypted database records reside exclusively within your specified SQLite database file (<code style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>vaultkey.db</code>) or Docker volume container. VaultKey does not transmit your vault contents or derived keys to third-party telemetry servers.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#f8fafc', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>3. Audit Logging & HMAC Ledger</h2>
          <p style={{ lineHeight: 1.6, color: '#cbd5e1' }}>
            To satisfy SOC2 and regulatory audit requirements, VaultKey maintains a tamper-evident HMAC-SHA256 chained ledger recording vault access events (unlock, secret creation, key retrieval). Audit logs capture timestamp, action name, actor ID, and IP address for incident response.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#f8fafc', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>4. Open-Source & License Compliance</h2>
          <p style={{ lineHeight: 1.6, color: '#cbd5e1' }}>
            VaultKey core dependencies are open-source and governed under OSI-compliant permissive licenses (MIT, BSD-3-Clause). All cryptographic implementations leverage standard audited Go standard library modules.
          </p>
        </section>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #1e293b', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
          VaultKey Enterprise Secrets Manager • Security Baseline Compliant
        </div>
      </div>
    </div>
  );
};
