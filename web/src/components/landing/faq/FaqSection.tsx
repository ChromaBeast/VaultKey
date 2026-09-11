import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does VaultKey prevent secrets from ever touching the disk?',
    answer:
      'The VaultKey CLI unlocks your vault in RAM and directly populates process memory environments (via execve on POSIX, CreateProcess on Windows) when launching your application. Plaintext secrets are never written to temporary files, bash histories, or swap storage.',
  },
  {
    question: 'Can VaultKey be self-hosted in an air-gapped environment?',
    answer:
      'Yes. VaultKey is compiled as a single static Go binary with an embedded SQLite engine. It has zero external database or cloud phone-home dependencies, making it fully operational in completely air-gapped or restricted internal networks.',
  },
  {
    question: 'How is the master encryption key derived and protected?',
    answer:
      'We use Argon2id with m=64MB memory bounds, 3 iterations, and 4 parallel threads. Decrypted key material is held exclusively in locked RAM pages (mlock) and scrubbed with zeroes the instant the lock trigger or child process exits.',
  },
  {
    question: 'How does the tamper-evident HMAC audit ledger work?',
    answer:
      'Every secret access, injection, update, or token creation generates a ledger entry cryptographically bound to the HMAC-SHA256 signature of the preceding row. Modifying or deleting any historical log record breaks chain validation.',
  },
  {
    question: 'How do CI/CD pipelines authenticate without storing static keys?',
    answer:
      'VaultKey provisions scoped, short-lived machine tokens with granular read-only policies. Tokens can be restricted to specific environments (e.g. production-only) and revoked instantly from the dashboard or CLI.',
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
                    background: isOpen ? 'rgba(60, 237, 235, 0.15)' : 'rgba(255, 255, 255, 0.05)',
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
