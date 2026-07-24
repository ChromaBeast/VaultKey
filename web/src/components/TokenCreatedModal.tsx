import React from 'react';

interface TokenCreatedModalProps {
  createdToken: string | null;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export const TokenCreatedModal: React.FC<TokenCreatedModalProps> = ({
  createdToken,
  copied,
  onCopy,
  onClose,
}) => {
  if (!createdToken) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div className="glass-glow animate-fade" style={{ width: '460px', padding: '32px', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
          🔑 API Access Token Created!
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
          Copy this token immediately. For zero-knowledge security, it will never be displayed again.
        </p>

        <div
          className="code-font"
          style={{
            background: '#090d16',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            wordBreak: 'break-all',
            marginBottom: '20px',
            color: '#60a5fa',
            fontSize: '0.9rem',
          }}
        >
          {createdToken}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCopy} className="btn btn-primary" style={{ background: copied ? '#10b981' : undefined }}>
            {copied ? '✓ Token Copied' : 'Copy Token'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
