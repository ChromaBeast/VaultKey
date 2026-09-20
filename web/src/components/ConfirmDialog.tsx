import React, { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={loading ? () => undefined : onClose} width={430}>
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          {danger && <TriangleAlert size={20} color="var(--vk-danger)" />}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--vk-text)' }}>{title}</h3>
        </div>

        {message && (
          <div style={{ color: 'var(--vk-text-secondary)', fontSize: '0.875rem', marginBottom: '16px', lineHeight: 1.55 }}>
            {message}
          </div>
        )}

        {confirmWord && (
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="confirm-word-input"
              className="code-font"
              style={{ display: 'block', fontSize: '0.78rem', color: 'var(--vk-text-secondary)', marginBottom: '6px' }}
            >
              Type <span style={{ color: 'var(--vk-danger)' }}>{confirmWord}</span> to confirm
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
