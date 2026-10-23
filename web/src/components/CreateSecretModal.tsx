import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Modal } from './ui/Modal';
import { SecretGeneratorModal } from './SecretGeneratorModal';
import { Input, Textarea } from './ui';

interface CreateSecretModalProps {
  isOpen: boolean;
  project: string;
  mode: 'create' | 'edit';
  initialKey?: string;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (key: string, value: string) => Promise<void>;
}

export const CreateSecretModal: React.FC<CreateSecretModalProps> = ({
  isOpen,
  project,
  mode,
  initialKey = '',
  initialValue = '',
  onClose,
  onSubmit,
}) => {
  const [key, setKey] = useState(initialKey);
  const [value, setValue] = useState(initialValue);
  const [genOpen, setGenOpen] = useState(false);
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
    <Modal label={isEdit ? "Edit secret" : "Create secret"} isOpen={isOpen} onClose={submitting ? () => undefined : onClose} width={460}>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isEdit ? 'Edit Secret Value' : 'Create Secret'}
            </h3>
            <span className="text-xs text-muted-foreground">
              Project: <strong className="text-primary">{project}</strong>
            </span>
          </div>
          {!isEdit && (
            <button
              type="button"
              onClick={() => setGenOpen(true)}
              className="btn btn-secondary text-xs px-2.5 py-1"
            >
              <KeyRound size={13} /> Generator
            </button>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="secret-key-input" className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Secret Name
          </label>
          <Input
            id="secret-key-input"
            mono
            placeholder="DATABASE_URL"
            maxLength={256}
            pattern="[A-Za-z0-9_.\-]+"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
            readOnly={isEdit}
            required
          />
          {isEdit && (
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Secret names are immutable; saving will create an append-only new version.
            </span>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="secret-value-input" className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Secret Value
          </label>
          <Textarea
            id="secret-value-input"
            mono
            placeholder="Enter or paste secret payload..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            rows={4}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Encrypting...' : isEdit ? 'Save New Version' : 'Save & Encrypt'}
          </button>
        </div>
      </form>
      {genOpen && <SecretGeneratorModal isOpen onClose={() => setGenOpen(false)} onUseSecret={setValue} />}
    </Modal>
  );
};
