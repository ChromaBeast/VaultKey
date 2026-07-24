import React from 'react';

export const BentoGridSection: React.FC = () => {
  return (
    <section id="features" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
          Zero-Trust Security Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
          Architected from the ground up for strict memory isolation and auditability
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Card 1 */}
        <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
            🔐
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Argon2id Key Derivation
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Master secrets are derived strictly in RAM with 64MB memory bounds. Unencrypted data is never written to disk or database logs.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
            ⚡
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Scoped Access Tokens
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Generate fine-grained tokens with dedicated <span className="badge badge-read">READ</span>, <span className="badge badge-write">WRITE</span>, or <span className="badge badge-admin">ADMIN</span> scopes for CI/CD workers.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
            🛡️
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Cryptographic Audit Ledger
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Every secret lookup and token generation is chained into an immutable HMAC-SHA256 log ledger for SOC2 compliance.
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
            🔥
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            1-Time Self-Destruct Links
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Safely share database credentials or access tokens via ephemeral end-to-end links that auto-purge after a single view.
          </p>
        </div>
      </div>
    </section>
  );
};
