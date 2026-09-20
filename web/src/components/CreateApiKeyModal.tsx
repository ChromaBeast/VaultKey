import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input, Select } from './ui';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, permissions: string) => Promise<void>;
  submitting?: boolean;
}

export const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting = false,
}) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('read');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(name, permissions);
    } catch {
      return;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={submitting ? () => undefined : onClose} width={420}>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        style={{ padding: '32px' }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--vk-text)', marginBottom: '16px' }}>
          Generate Scoped API Key
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="apikey-label-input" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '6px' }}>
            Key Label / Application Name
          </label>
          <Input
            id="apikey-label-input"
            placeholder="e.g. GitHub Actions CI / Prod SDK"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="apikey-scope-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '6px' }}>
            Permissions Scope
          </label>
          <Select id="apikey-scope-select" value={permissions} onChange={(e) => setPermissions(e.target.value)}>
            <option value="read">Read Only (Fetch Secrets)</option>
            <option value="write">Read & Write (Manage Secrets)</option>
            <option value="admin">Full Admin (Org & Key Management)</option>
          </Select>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Generating...' : 'Generate Key'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
