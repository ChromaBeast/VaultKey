import React, { useState } from 'react';
import type { SecretItem } from '../lib/api';
import { deleteSecret, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { ConfirmDialog } from './ConfirmDialog';

interface DeleteSecretDialogProps {
  item: SecretItem | null;
  project: string;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteSecretDialog: React.FC<DeleteSecretDialogProps> = ({
  item,
  project,
  onClose,
  onDeleted,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!item) return;
    setDeleting(true);
    try {
      await deleteSecret(item.key, project);
      pushToast(`Secret ${item.key} deleted`, 'success');
      onDeleted();
      onClose();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to delete secret'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={item !== null}
      title="Permanently delete secret?"
      message={`This permanently destroys secret "${item?.key ?? ''}" from environment "${project}". The deletion is irreversibly logged into the cryptographic audit ledger.`}
      confirmLabel="Delete Secret"
      danger
      loading={deleting}
      confirmWord={item?.key}
      onConfirm={() => void handleDelete()}
      onClose={onClose}
    />
  );
};
