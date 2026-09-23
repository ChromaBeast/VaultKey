import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--vk-bg)', color: 'var(--vk-text)', padding: '40px 20px' }}>
      <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: 'var(--vk-accent)' }}>VaultKey Privacy & Security</h1>
          <Link to="/" style={{ color: 'var(--vk-text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>&larr; Back to Home</Link>
        </div>

        <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Last Updated: September 2026
        </p>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--vk-text)', borderBottom: '1px solid var(--vk-border)', paddingBottom: '8px' }}>
            1. Zero-Trust In-Memory Security Model
          </h2>
          <p style={{ lineHeight: 1.6, color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            Stored secret values are encrypted before they are written to the database. The master key is derived in memory and cleared when the vault locks. While a secret is being used, its plaintext necessarily exists in application memory. The CLI export and pull commands intentionally write plaintext to files you choose; secure and remove those files yourself.
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
            VaultKey records security events in an HMAC-SHA256 chained audit log. Records may include timestamps, event names, actor identifiers, IP addresses, and user-agent strings. This technical control is not a SOC 2 or ISO 27001 certification and does not by itself establish compliance.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--vk-text)', borderBottom: '1px solid var(--vk-border)', paddingBottom: '8px' }}>
            4. Email and Payment Providers
          </h2>
          <p style={{ lineHeight: 1.6, color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            Account verification, password reset, and team invitation messages use the email provider configured by the service operator. Paid subscriptions use Razorpay; VaultKey stores subscription and transaction references, not card details. Provider availability and data handling are governed by those providers' terms and privacy notices.
          </p>
        </section>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--vk-border)', fontSize: '0.75rem', color: 'var(--vk-text-muted)', textAlign: 'center' }}>
          For self-hosted installations, the operator controls the database, backups, and configured service providers.
        </div>
      </div>
    </div>
  );
};
