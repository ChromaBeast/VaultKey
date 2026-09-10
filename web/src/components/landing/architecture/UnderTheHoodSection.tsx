import React from 'react';
import { Link } from 'react-router-dom';

const TECH_PILLARS = [
  { title: 'Compiled in Go', desc: 'Single static binary with zero external runtime dependencies.' },
  { title: 'Embedded SQLite WAL', desc: 'High-throughput write-ahead logging with automatic busy-retry.' },
  { title: 'Single-Binary Bundle', desc: 'React SPA embedded directly into the Go binary at compile time.' },
  { title: 'Lightweight Docker', desc: 'Minimal container image ready to deploy to any VPS in 60 seconds.' },
];

export const UnderTheHoodSection: React.FC = () => {
  return (
    <section
      id="architecture"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div
        className="glass"
        style={{
          padding: '36px',
          borderRadius: '16px',
          background: 'rgba(14, 18, 27, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f5f7fa', margin: 0 }}>
              Engineered for simplicity and data sovereignty.
            </h3>
          </div>
          <Link
            to="/docs"
            style={{
              color: '#5ee7ff',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Read the architecture →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {TECH_PILLARS.map((p) => (
            <div
              key={p.title}
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f7fa', marginBottom: '6px' }}>
                {p.title}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#8b93a3', lineHeight: 1.5, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
