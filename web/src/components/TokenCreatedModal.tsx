import React from 'react';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';

interface TokenCreatedModalProps {
  createdToken: string | null;
  onClose: () => void;
}

export const TokenCreatedModal: React.FC<TokenCreatedModalProps> = ({ createdToken, onClose }) => {
  const { copied, copy } = useClipboard();

  if (!createdToken) return null;

  return (
    <Modal isOpen onClose={onClose} width={460}>
      <div style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
          API Access Token Created
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
          Copy this token now. It is shown only once and cannot be recovered.
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
          <button
            onClick={() => void copy(createdToken)}
            className="btn btn-primary"
            style={copied ? { background: '#10b981' } : undefined}
          >
            {copied ? 'Token Copied' : 'Copy Token'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
