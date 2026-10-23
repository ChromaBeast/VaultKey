import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-5">
      <div className="glass max-w-3xl mx-auto p-8 rounded-xl border border-border">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-primary">VaultKey Privacy & Security</h1>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            &larr; Back to Home
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Last Updated: September 2026
        </p>

        <section className="mb-6">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
            1. Zero-Trust In-Memory Security Model
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Stored secret values are encrypted before they are written to the database. The master key is derived in memory and cleared when the vault locks. While a secret is being used, its plaintext necessarily exists in application memory. The CLI export and pull commands intentionally write plaintext to files you choose; secure and remove those files yourself.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
            2. Data Residency & Local Storage
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            When self-hosted, all encrypted database records reside exclusively within your specified SQLite database file (<code className="code-font bg-surface-2 px-1.5 py-0.5 rounded text-primary">vaultkey.db</code>) or Docker volume container. VaultKey does not transmit your vault contents or derived keys to third-party telemetry servers.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
            3. Audit Logging & HMAC Ledger
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            VaultKey records security events in an HMAC-SHA256 chained audit log. Records may include timestamps, event names, actor identifiers, IP addresses, and user-agent strings. This technical control is not a SOC 2 or ISO 27001 certification and does not by itself establish compliance.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
            4. Email and Payment Providers
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Account verification, password reset, and team invitation messages use the email provider configured by the service operator. Paid subscriptions use Razorpay; VaultKey stores subscription and transaction references, not card details. Provider availability and data handling are governed by those providers' terms and privacy notices.
          </p>
        </section>

        <div className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground text-center">
          For self-hosted installations, the operator controls the database, backups, and configured service providers.
        </div>
      </div>
    </div>
  );
};
