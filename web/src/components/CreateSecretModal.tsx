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
    <Modal isOpen={isOpen} onClose={submitting ? () => undefined : onClose} width={440}>
      <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              {isEdit ? 'Edit Secret Value' : 'New Secret'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Target Project: <strong style={{ color: '#c084fc' }}>{project}</strong>
            </span>
          </div>
          {!isEdit && onOpenGenerator && (
            <button
              type="button"
              onClick={onOpenGenerator}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <Dices size={14} /> Generator
            </button>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="secret-key-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
            Secret Key Name
          </label>
          <input
            id="secret-key-input"
            className="input code-font"
            placeholder="DATABASE_URL / API_KEY"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
            readOnly={isEdit}
            required
          />
          {isEdit && (
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
              Key names are immutable; only the value can be updated.
            </span>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="secret-value-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
            Secret Value
          </label>
          <textarea
            id="secret-value-input"
            className="input code-font"
            placeholder="super_secret_value_123"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            style={{ minHeight: '90px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Encrypting...' : isEdit ? 'Save New Value' : 'Save & Encrypt'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
