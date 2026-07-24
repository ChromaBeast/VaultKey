import React from 'react';
import { Link } from 'react-router-dom';

export const PricingTeaserSection: React.FC = () => {
  return (
    <section style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
          Transparent Team Pricing
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
          Start free with no credit card required. Upgrade as your engineering team scales.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Free Starter */}
        <div className="glass" style={{ padding: '32px', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Free Starter</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '14px 0 6px', color: '#f8fafc' }}>$0</div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>For individual devs & micro projects</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '28px' }}>
            <li>⚡ 25 secrets</li>
            <li>🔑 2 API keys</li>
            <li>🛡️ Argon2id RAM derivation</li>
          </ul>
          <Link to="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Get Started Free
          </Link>
        </div>

        {/* Pro Team */}
        <div className="glass-glow" style={{ padding: '32px', borderRadius: '18px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#6366f1', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
            Popular
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#818cf8' }}>Pro Team</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '14px 0 6px', color: '#f8fafc' }}>$19 <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}>/ mo</span></div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>For growing engineering teams</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '28px' }}>
            <li>✨ <strong>Unlimited secrets</strong></li>
            <li>⚡ <strong>Unlimited API keys</strong></li>
            <li>🛡️ 90-day HMAC audit ledger</li>
          </ul>
          <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Start 14-Day Trial →
          </Link>
        </div>

        {/* Enterprise */}
        <div className="glass" style={{ padding: '32px', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Enterprise</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '14px 0 6px', color: '#f8fafc' }}>Custom</div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Dedicated VPS & SLA compliance</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '28px' }}>
            <li>🖥️ Isolated VPS deployment</li>
            <li>🔐 SAML SSO / Okta Integration</li>
            <li>⏱️ 99.99% Uptime SLA</li>
          </ul>
          <Link to="/docs" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};
