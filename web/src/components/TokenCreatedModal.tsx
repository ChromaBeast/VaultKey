import React from 'react';
import { IconTile } from './ui/IconTile';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';
import { Bot, Check, CircleCheck, Copy, ShieldAlert } from 'lucide-react';

interface TokenCreatedModalProps {
  createdToken: string | null;
  onClose: () => void;
  onConnectAgent?: () => void;
}

export const TokenCreatedModal: React.FC<TokenCreatedModalProps> = ({ createdToken, onClose, onConnectAgent }) => {
  const { copied, copy } = useClipboard();

  if (!createdToken) return null;

  return (
    <Modal label="API key created" isOpen onClose={onClose} width={480}>
      <div className="dlg">
        <div className="dlg-head">
          <IconTile tone="green"><CircleCheck size={20} /></IconTile>
          <h3>API Key Created</h3>
        </div>
        <p className="dlg-sub">
          This token will only be shown once. Store it in your CI/CD environment or secret manager before closing.
        </p>

        <div className="code-font dlg-token">{createdToken}</div>

        <div className="dlg-note dlg-note-warn">
          <ShieldAlert size={14} />
          <span>After dismissal, this raw token can never be retrieved from the server again.</span>
        </div>

        <div className="dlg-actions">
          <button onClick={() => void copy(createdToken)} className="btn btn-primary">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard' : 'Copy Token'}
          </button>
          {onConnectAgent && (
            <button onClick={onConnectAgent} className="btn btn-secondary">
              <Bot size={14} /> Connect Agent
            </button>
          )}
          <button onClick={onClose} className="btn btn-secondary">Done</button>
        </div>
      </div>
    </Modal>
  );
};
