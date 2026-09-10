import React from 'react';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';
import { Check, Copy, ShieldAlert } from 'lucide-react';

interface TokenCreatedModalProps {
  createdToken: string | null;
  onClose: () => void;
}

export const TokenCreatedModal: React.FC<TokenCreatedModalProps> = ({ createdToken, onClose }) => {
  const { copied, copy } = useClipboard();

  if (!createdToken) return null;

  return (
    <Modal isOpen onClose={onClose} width={480}>
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--vk-text)', marginBottom: '4px' }}>
          API Key Created
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--vk-text-muted)', marginBottom: '14px' }}>
          This token will only be shown once. Store it in your CI/CD environment or secret manager before closing.
        </p>

        <div
          className="code-font"
          style={{
            background: '#07090e',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(67, 211, 158, 0.3)',
            wordBreak: 'break-all',
            marginBottom: '16px',
            color: 'var(--vk-success)',
            fontSize: '0.85rem',
            lineHeight: 1.4,
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {createdToken}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--vk-warning-dim)',
            border: '1px solid rgba(244, 199, 106, 0.25)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.75rem',
            color: 'var(--vk-warning)',
          }}
        >
          <ShieldAlert size={14} style={{ flexShrink: 0 }} />
          <span>After dismissal, this raw token can never be retrieved from the server again.</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => void copy(createdToken)}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard' : 'Copy Token'}
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
