import React from 'react';

interface RevealSecretModalProps {
  secretKey: string;
  secretVal: string;
  shareUrl: string | null;
  copied: boolean;
  onClose: () => void;
  onCopy: () => void;
  onCreateShareLink: (val: string) => void;
}

export const RevealSecretModal: React.FC<RevealSecretModalProps> = ({
  secretKey,
  secretVal,
  shareUrl,
  copied,
  onClose,
  onCopy,
  onCreateShareLink,
}) => {
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="code-font" style={{ fontSize: '1.2rem', color: '#c084fc', fontWeight: 700 }}>
            {secretKey}
          </h3>
          <span className="badge badge-write">Decrypted in RAM</span>
        </div>

        <div
          className="code-font"
          style={{
            background: '#090d16',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            wordBreak: 'break-all',
            marginBottom: '20px',
            color: '#34d399',
            fontSize: '0.95rem',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          {secretVal}
        </div>

        {shareUrl && (
          <div
            style={{
              marginBottom: '20px',
              background: 'rgba(139, 92, 246, 0.12)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
              🔥 Self-Destructing 1-Time Link:
            </div>
            <div className="code-font" style={{ fontSize: '0.825rem', color: '#c084fc', wordBreak: 'break-all' }}>
              {shareUrl}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onCreateShareLink(secretVal)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            🔗 1-Time Link
          </button>
          <button
            onClick={onCopy}
            className="btn btn-primary"
            style={{ background: copied ? '#10b981' : undefined }}
          >
            {copied ? '✓ Copied' : 'Copy Value'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
