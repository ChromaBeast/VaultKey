import React, { useState } from 'react';

interface CreateSecretModalProps {
  isOpen: boolean;
  project: string;
  onClose: () => void;
  onSubmit: (key: string, value: string) => Promise<void>;
  onOpenGenerator: () => void;
}

export const CreateSecretModal: React.FC<CreateSecretModalProps> = ({
  isOpen,
  project,
  onClose,
  onSubmit,
  onOpenGenerator,
}) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(key, value);
      setKey('');
      setValue('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass-glow animate-fade"
        style={{ width: '440px', padding: '32px', borderRadius: '20px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>New Secret</h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Target Project: <strong style={{ color: '#c084fc' }}>{project}</strong></span>
          </div>
          <button
            type="button"
            onClick={onOpenGenerator}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            🎲 Generator
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
            Secret Key Name
          </label>
          <input
            className="input code-font"
            placeholder="DATABASE_URL / API_KEY"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
            Secret Value
          </label>
          <textarea
            className="input code-font"
            placeholder="super_secret_value_123"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            style={{ minHeight: '90px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Encrypting...' : 'Save & Encrypt'}
          </button>
        </div>
      </form>
    </div>
  );
};
