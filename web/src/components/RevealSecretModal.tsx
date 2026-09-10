import React, { useState } from 'react';
import { Link2, ShieldAlert } from 'lucide-react';
import { createShareLink, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';

interface RevealSecretModalProps {
  secretKey: string;
  secretVal: string;
  onClose: () => void;
}

export const RevealSecretModal: React.FC<RevealSecretModalProps> = ({ secretKey, secretVal, onClose }) => {
  const { copied, copy } = useClipboard();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const handleCreateShareLink = async () => {
    setSharing(true);
    try {
      const res = await createShareLink(secretVal);
      setShareUrl(`${window.location.origin}${res.share_url}`);
      pushToast('1-time self-destructing link created', 'success');
    } catch (err) {
      pushToast(errorMessage(err), 'error');
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} width={480}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 className="code-font" style={{ fontSize: '1.15rem', color: 'var(--vk-text)', fontWeight: 700 }}>
              {secretKey}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <ShieldAlert size={12} color="var(--vk-warning)" /> Decrypted temporarily in client RAM
            </div>
          </div>
          <span className="badge badge-write">DECRYPTED</span>
        </div>

        <div
          className="code-font"
          style={{
            background: '#07090e',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--vk-border)',
            wordBreak: 'break-all',
            marginBottom: '18px',
            color: 'var(--vk-success)',
            fontSize: '0.9rem',
            lineHeight: 1.45,
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {secretVal}
        </div>

        {shareUrl && (
          <div
            style={{
              marginBottom: '18px',
              background: 'var(--vk-accent-dim)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(115, 230, 255, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--vk-text-muted)', marginBottom: '3px', fontWeight: 600 }}>
              Self-Destructing 1-Time Link (Single View):
            </div>
            <div className="code-font" style={{ fontSize: '0.8rem', color: 'var(--vk-accent)', wordBreak: 'break-all' }}>
              {shareUrl}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => void handleCreateShareLink()}
            disabled={sharing}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <Link2 size={13} /> {sharing ? 'Creating...' : '1-Time Link'}
          </button>
          <button
            onClick={() => void copy(secretVal)}
            className="btn btn-primary"
            style={{ fontSize: '0.78rem' }}
          >
            {copied ? 'Copied' : 'Copy Value'}
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
