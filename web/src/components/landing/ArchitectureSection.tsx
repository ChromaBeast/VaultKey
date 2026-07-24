import React from 'react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 24px' }}>
      <div className="glass-glow" style={{ padding: '36px', borderRadius: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              TECHNICAL DEEP DIVE
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Engineered on Go 1.26.5 & SQLite WAL Mode
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
              VaultKey runs as a single compiled Go 1.26.5 binary with embedded React frontend assets, delivering sub-5ms API response times with zero external infrastructure dependencies.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#34d399' }}>✓</span> Ultra-lightweight Docker container (&lt; 25MB total image)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#34d399' }}>✓</span> SQLite WAL journaling with automatic busy-handler retry
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#34d399' }}>✓</span> coTURN WebRTC TURN/STUN server relay support
              </li>
            </ul>
          </div>

          <div style={{ background: '#090c14', padding: '24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '12px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              <span>CRYPTOGRAPHIC SPECIFICATION</span>
              <span style={{ color: '#34d399' }}>VERIFIED</span>
            </div>
            <div className="code-font" style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong style={{ color: '#818cf8' }}>Primitive:</strong> AES-256-GCM</div>
              <div><strong style={{ color: '#818cf8' }}>Key Derivation:</strong> Argon2id (m=64MB, t=4, p=2)</div>
              <div><strong style={{ color: '#818cf8' }}>Log Integrity:</strong> HMAC-SHA256 Hash Chaining</div>
              <div><strong style={{ color: '#818cf8' }}>Runtime:</strong> Go 1.26.5 Linux x86_64</div>
              <div><strong style={{ color: '#818cf8' }}>Latency:</strong> &lt; 4.2ms p99</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
