import React from 'react';

const PIPELINE_STEPS = [
  {
    step: '01',
    tag: 'DERIVATION',
    title: 'Client-Side KDF',
    desc: 'Master key derived client-side; never leaves memory.',
  },
  {
    step: '02',
    tag: 'RAM BUFFER',
    title: 'Locked Memory Page',
    desc: 'Decrypted secrets reside in locked RAM pages.',
  },
  {
    step: '03',
    tag: 'INJECTION',
    title: 'Process Execve',
    desc: 'Credentials injected directly into child process memory.',
  },
  {
    step: '04',
    tag: 'ZEROIZATION',
    title: 'Atomic Scrub',
    desc: 'Buffers zeroed immediately upon process exit.',
  },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section
      id="architecture"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '720px', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--vk-accent)',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Security Architecture
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--vk-text)',
            lineHeight: 1.2,
            marginTop: '8px',
            marginBottom: '16px',
          }}
        >
          Memory-only pipeline. Zero plaintext on disk.
        </h2>
        <p style={{ color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-base)', lineHeight: 1.65, margin: 0 }}>
          Secrets remain strictly in process memory during execution and encrypted at rest.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {PIPELINE_STEPS.map((s) => (
          <div
            key={s.step}
            className="glass"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--vk-accent)', fontWeight: 700 }}>
                  {s.step}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--font-size-2xs)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--vk-accent-dim)',
                    color: 'var(--vk-accent)',
                    border: '1px solid rgba(91, 141, 239, 0.25)',
                  }}
                >
                  {s.tag}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--vk-text)', marginBottom: '8px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--vk-text-muted)', lineHeight: 1.5, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
