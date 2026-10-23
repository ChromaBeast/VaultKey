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
      pushToast('1-time share link created', 'success');
    } catch (err) {
      pushToast(errorMessage(err), 'error');
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal label="Reveal secret" isOpen onClose={onClose} width={480}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="font-mono text-base font-bold text-foreground">
            {secretKey}
          </h3>
          <span className="badge badge-write">DECRYPTED</span>
        </div>

        <div className="font-mono bg-background p-3.5 rounded-lg border border-border break-all mb-4 text-emerald-400 text-sm leading-relaxed select-all">
          {secretVal}
        </div>

        {shareUrl && (
          <div className="mb-4 bg-primary/10 p-3 rounded-lg border border-primary/25">
            <div className="text-[11px] text-muted-foreground mb-1 font-semibold">
              1-Time Share Link:
            </div>
            <div className="font-mono text-xs text-primary break-all">
              {shareUrl}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end flex-wrap">
          <button
            onClick={() => void handleCreateShareLink()}
            disabled={sharing}
            className="btn btn-secondary text-xs"
          >
            <Link2 size={13} /> {sharing ? 'Creating…' : '1-Time Link'}
          </button>
          <button
            onClick={() => void copy(secretVal)}
            className="btn btn-primary text-xs"
          >
            {copied ? 'Copied' : 'Copy Value'}
          </button>
          <button onClick={onClose} className="btn btn-secondary text-xs">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
