import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import { Modal } from './ui/Modal';

interface CreateSecretModalProps {
  isOpen: boolean;
  project: string;
  mode: 'create' | 'edit';
  initialKey?: string;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (key: string, value: string) => Promise<void>;
  onOpenGenerator?: () => void;
}

export const CreateSecretModal: React.FC<CreateSecretModalProps> = ({
  isOpen,
  project,
  mode,
  initialKey = '',
  initialValue = '',
  onClose,
  onSubmit,
  onOpenGenerator,
}) => {
  const [key, setKey] = useState(initialKey);
  const [value, setValue] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(key, value);
    } catch {
      return;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={submitting ? () => undefined : onClose} width={460}>
      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--vk-text)' }}>
              {isEdit ? 'Edit Secret Value' : 'Create Secret'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)' }}>
              Target Environment: <strong style={{ color: 'var(--vk-accent)' }}>{project}</strong>
            </span>
          </div>
          {!isEdit && onOpenGenerator && (
            <button
              type="button"
              onClick={onOpenGenerator}
              className="btn btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
            >
              <Dices size={13} /> Generator
            </button>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="secret-key-input" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}>
            Secret Name
          </label>
          <input
            id="secret-key-input"
            className="input code-font"
            placeholder="DATABASE_URL / STRIPE_SECRET_KEY"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
            readOnly={isEdit}
            required
            style={{ fontSize: '0.875rem' }}
          />
          {isEdit && (
            <span style={{ fontSize: '0.7rem', color: 'var(--vk-text-muted)', marginTop: '4px', display: 'block' }}>
              Secret names are immutable; saving will create an append-only new version.
            </span>
          )}
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label htmlFor="secret-value-input" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}>
            Secret Value
          </label>
          <textarea
            id="secret-value-input"
            className="input code-font"
            placeholder="Enter or paste secret payload..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            style={{ minHeight: '96px', resize: 'vertical', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Encrypting...' : isEdit ? 'Save New Version' : 'Save & Encrypt'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
