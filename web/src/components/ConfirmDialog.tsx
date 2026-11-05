import React, { useState } from 'react';
import { IconTile } from './ui/IconTile';
import { TriangleAlert, Info } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input } from './ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  confirmWord?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  confirmWord,
  onConfirm,
  onClose,
}) => {
  const [typed, setTyped] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setTyped('');
  }

  const confirmed = !confirmWord || typed === confirmWord;

  return (
    <Modal label={title} isOpen={isOpen} onClose={loading ? () => undefined : onClose} width={430}>
      <div className="dlg dlg-lg">
        <div className="dlg-head">
          <IconTile tone={danger ? 'red' : 'blue'} size="sm">{danger ? <TriangleAlert size={16} /> : <Info size={16} />}</IconTile>
          <h3>{title}</h3>
        </div>

        {message && <div className="dlg-message">{message}</div>}

        {confirmWord && (
          <div className="dlg-field">
            <label htmlFor="confirm-word-input" className="code-font">
              Type <span>{confirmWord}</span> to confirm
            </label>
            <Input
              id="confirm-word-input"
              mono
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        <div className="dlg-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={!confirmed || loading}
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
