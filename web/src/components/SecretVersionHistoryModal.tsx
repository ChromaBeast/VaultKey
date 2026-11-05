import React, { useEffect, useState } from 'react';
import { History, RotateCcw } from 'lucide-react';
import type { SecretVersionItem } from '../lib/api';
import { fetchSecretVersions, rollbackSecretVersion, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ConfirmDialog';

interface SecretVersionHistoryModalProps {
  canWrite: boolean;
  secretKey: string;
  project: string;
  currentVersion: number;
  onClose: () => void;
  onRollbackSuccess: () => void;
}

export const SecretVersionHistoryModal: React.FC<SecretVersionHistoryModalProps> = ({
  canWrite,
  secretKey,
  project,
  currentVersion,
  onClose,
  onRollbackSuccess,
}) => {
  const [versions, setVersions] = useState<SecretVersionItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rollbackTarget, setRollbackTarget] = useState<number | null>(null);
  const [rollbackLoading, setRollbackLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSecretVersions(secretKey, project)
      .then((data) => {
        if (!cancelled) setVersions(data || []);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(errorMessage(error, "Could not load version history. Close and reopen to retry."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [secretKey, project]);

  const handleRollback = async () => {
    if (rollbackTarget === null) return;
    setRollbackLoading(true);
    try {
      await rollbackSecretVersion(secretKey, { project, version: rollbackTarget });
      pushToast(`Rolled back ${secretKey} to v${rollbackTarget}`, 'success');
      onRollbackSuccess();
      onClose();
    } catch (err) {
      pushToast(errorMessage(err, 'Rollback failed'), 'error');
    } finally {
      setRollbackLoading(false);
      setRollbackTarget(null);
    }
  };

  return (
    <Modal label="Version history" isOpen onClose={onClose} width={520}>
      <div className="dlg">
        <div className="history-head">
          <div>
            <h3><History size={16} /> Version History &amp; Rollback</h3>
            <p>Key: <code>{secretKey}</code> (Active: v{currentVersion})</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} aria-label="Close history">✕</button>
        </div>

        {loadError ? <p role="alert" className="text-sm text-destructive">{loadError}</p> : loading ? (
          <div className="history-empty">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="history-empty">No previous version history recorded yet.</div>
        ) : (
          <div className="history-list">
            {versions.map((item) => {
              const isCurrent = item.version === currentVersion;
              return (
                <div key={item.id || `ver-${item.version}`} className={`history-row${isCurrent ? ' is-current' : ''}`}>
                  <div className="history-meta">
                    <span className="code-font history-version">v{item.version}</span>
                    {isCurrent && <span className="badge badge-write">CURRENT</span>}
                    <span className="history-date">{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  {!isCurrent && canWrite && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setRollbackTarget(item.version)}>
                      <RotateCcw size={12} /> Restore v{item.version}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={rollbackTarget !== null}
        title={`Rollback ${secretKey}?`}
        message={`The active secret value will be rolled back to snapshot v${rollbackTarget}. An immutable rollback entry will be appended to the audit ledger.`}
        confirmLabel="Confirm Rollback"
        danger
        loading={rollbackLoading}
        onConfirm={handleRollback}
        onClose={() => setRollbackTarget(null)}
      />
    </Modal>
  );
};
