import React, { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Modal } from './ui/Modal';

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
    <Modal isOpen={isOpen} onClose={loading ? () => undefined : onClose} width={430}>
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          {danger && <TriangleAlert size={20} color="#f87171" />}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{title}</h3>
        </div>

        {message && (
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '16px', lineHeight: 1.55 }}>
            {message}
          </div>
        )}

        {confirmWord && (
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="confirm-word-input"
              className="code-font"
              style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}
            >
              Type <span style={{ color: '#f87171' }}>{confirmWord}</span> to confirm
            </label>
            <input
              id="confirm-word-input"
              className="input code-font"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
