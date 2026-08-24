import React, { useState } from 'react';
import { Link2 } from 'lucide-react';
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
    <Modal isOpen onClose={onClose} width={460}>
      <div style={{ padding: '32px' }}>
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
              Self-Destructing 1-Time Link:
            </div>
            <div className="code-font" style={{ fontSize: '0.825rem', color: '#c084fc', wordBreak: 'break-all' }}>
              {shareUrl}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => void handleCreateShareLink()} disabled={sharing} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            <Link2 size={14} /> {sharing ? 'Creating...' : '1-Time Link'}
          </button>
          <button
            onClick={() => void copy(secretVal)}
            className="btn btn-primary"
            style={copied ? { background: '#10b981' } : undefined}
          >
            {copied ? 'Copied' : 'Copy Value'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
