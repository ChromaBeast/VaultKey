import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does VaultKey prevent secrets from ever touching the disk?',
    answer:
      'The VaultKey CLI unlocks your vault in RAM and directly populates process memory environments (via execve/process spawning) when launching your application. Plaintext secrets are never written to temporary files, bash histories, or cache directories.',
  },
  {
    question: 'Can VaultKey be self-hosted in our own cloud environment?',
    answer:
      'Yes. VaultKey is distributed as a single static binary and a lightweight Docker image with SQLite built in. You can run it on any Linux VPS, Docker host, or Kubernetes cluster with zero external database dependencies.',
  },
  {
    question: 'What happens if an engineer leaves the team?',
    answer:
      'You can revoke their user account or rotate team credentials with a single click. Their local CLI tokens are immediately invalidated without affecting running production services or requiring application restarts.',
  },
  {
    question: 'How does the cryptographic audit ledger work?',
    answer:
      'Every read, injection, modification, and token generation creates an entry chained to the cryptographic HMAC-SHA256 hash of the previous record. If any entry is altered or removed directly from SQLite, the cryptographic chain fails verification.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '100px auto 0',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: '36px' }}>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f5f7fa',
            lineHeight: 1.18,
            marginBottom: '16px',
          }}
        >
          Engineering & security answers.
        </h2>
        <p style={{ color: '#8b93a3', fontSize: '0.95rem', lineHeight: 1.65 }}>
          Everything you need to know about VaultKey’s operational model and security guarantees.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="glass"
              style={{
                borderRadius: '12px',
                background: 'rgba(14, 18, 27, 0.65)',
                border: isOpen ? '1px solid rgba(94, 231, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#f5f7fa',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                }}
              >
                <span>{faq.question}</span>
                <span style={{ color: '#5ee7ff', fontSize: '1rem', marginLeft: '16px' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: '0 20px 18px',
                    fontSize: '0.85rem',
                    color: '#8b93a3',
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
