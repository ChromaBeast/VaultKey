import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does VaultKey prevent secrets from ever touching the disk?',
    answer:
      'VaultKey unlocks secrets in RAM and injects them directly into child process memory via execve, never writing plaintext to disk.',
  },
  {
    question: 'Can VaultKey be self-hosted in an air-gapped environment?',
    answer:
      'Yes, VaultKey is a single static Go binary with an embedded SQLite engine and zero external dependencies.',
  },
  {
    question: 'How is the master encryption key derived and protected?',
    answer:
      'Keys are derived client-side via Argon2id, held strictly in locked RAM pages, and scrubbed with zeroes on process exit.',
  },
  {
    question: 'How does the tamper-evident HMAC audit ledger work?',
    answer:
      'Every secret operation cryptographically signs and chains to the preceding log row using HMAC-SHA256.',
  },
  {
    question: 'How do CI/CD pipelines authenticate without storing static keys?',
    answer:
      'Pipelines authenticate via scoped, short-lived machine tokens that can be restricted to specific environments and revoked instantly.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '720px', marginBottom: '36px' }}>
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
          FAQ
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
          Frequently Asked Questions
        </h2>
        <p style={{ color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-base)', lineHeight: 1.65, margin: 0 }}>
          Cryptographic guarantees, memory lifecycle, and deployment questions answered directly.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: isOpen ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
              className="group hover:bg-white/[0.03] hover:border-white/15"
            >
              <button
                id={`faq-trigger-${idx}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isOpen ? 'var(--vk-accent)' : 'var(--vk-text)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 600,
                  transition: 'color 0.15s ease',
                }}
              >
                <span style={{ paddingRight: '16px' }}>{faq.question}</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: isOpen ? 'var(--vk-accent-dim)' : 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--vk-accent)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  style={{
                    padding: '0 20px 18px',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--vk-text-muted)',
                    lineHeight: 1.65,
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
