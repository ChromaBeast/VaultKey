import React, { useState } from 'react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, permissions: string) => Promise<void>;
}

export const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('read');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(name, permissions);
      setName('');
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
        style={{ width: '420px', padding: '32px', borderRadius: '20px' }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
          Generate Scoped API Key
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
            Key Label / Application Name
          </label>
          <input
            className="input"
            placeholder="e.g. GitHub Actions CI / Prod SDK"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
            Permissions Scope
          </label>
          <select
            className="input"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
          >
            <option value="read">Read Only (Fetch Secrets)</option>
            <option value="write">Read & Write (Manage Secrets)</option>
            <option value="admin">Full Admin (Org & Key Management)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Generating...' : 'Generate Key'}
          </button>
        </div>
      </form>
    </div>
  );
};
