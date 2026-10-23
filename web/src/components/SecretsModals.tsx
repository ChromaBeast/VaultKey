import React from 'react';
import type { SecretItem } from '../lib/api';
import { CreateSecretModal } from './CreateSecretModal';
import { DeleteSecretDialog } from './DeleteSecretDialog';
import { RevealSecretModal } from './RevealSecretModal';
import { SecretGeneratorModal } from './SecretGeneratorModal';
import { SecretVersionHistoryModal } from './SecretVersionHistoryModal';

export type ModalTarget = { mode: 'create' | 'edit'; initialKey?: string; initialValue?: string };

interface SecretsModalsProps {
  canWrite: boolean;
  project: string;
  genOpen: boolean;
  onCloseGen: () => void;
  onUseGeneratedSecret: (secret: string) => void;
  modalTarget: ModalTarget | null;
  onCloseModalTarget: () => void;
  onSubmitSecret: (key: string, value: string) => Promise<void>;
  historyItem: { key: string; version: number } | null;
  onCloseHistory: () => void;
  onRollbackSuccess: () => void;
  revealedVal: { key: string; val: string } | null;
  onCloseReveal: () => void;
  deleteItem: SecretItem | null;
  onCloseDelete: () => void;
  onDeleted: () => void;
}

export const SecretsModals: React.FC<SecretsModalsProps> = ({
  canWrite,
  project,
  genOpen,
  onCloseGen,
  onUseGeneratedSecret,
  modalTarget,
  onCloseModalTarget,
  onSubmitSecret,
  historyItem,
  onCloseHistory,
  onRollbackSuccess,
  revealedVal,
  onCloseReveal,
  deleteItem,
  onCloseDelete,
  onDeleted,
}) => {
  return (
    <>
      {genOpen && (
        <SecretGeneratorModal
          isOpen
          onClose={onCloseGen}
          onUseSecret={onUseGeneratedSecret}
        />
      )}
      {modalTarget !== null && (
        <CreateSecretModal
          key={`${modalTarget.mode}-${modalTarget.initialKey ?? ''}`}
          isOpen
          project={project}
          mode={modalTarget.mode}
          initialKey={modalTarget.initialKey}
          initialValue={modalTarget.initialValue}
          onClose={onCloseModalTarget}
          onSubmit={onSubmitSecret}
        />
      )}
      {historyItem && (
        <SecretVersionHistoryModal
          canWrite={canWrite}
          secretKey={historyItem.key}
          project={project}
          currentVersion={historyItem.version}
          onClose={onCloseHistory}
          onRollbackSuccess={onRollbackSuccess}
        />
      )}
      {revealedVal && (
        <RevealSecretModal
          secretKey={revealedVal.key}
          secretVal={revealedVal.val}
          onClose={onCloseReveal}
        />
      )}
      <DeleteSecretDialog
        item={deleteItem}
        project={project}
        onClose={onCloseDelete}
        onDeleted={onDeleted}
      />
    </>
  );
};
