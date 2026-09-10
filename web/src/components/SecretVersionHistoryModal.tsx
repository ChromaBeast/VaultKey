import React, { useEffect, useState } from 'react';
import { History, RotateCcw } from 'lucide-react';
import type { SecretVersionItem } from '../lib/api';
import { fetchSecretVersions, rollbackSecretVersion, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { Modal } from './ui/Modal';
import { ConfirmDialog } from './ConfirmDialog';

interface SecretVersionHistoryModalProps {
  secretKey: string;
  project: string;
  currentVersion: number;
  onClose: () => void;
  onRollbackSuccess: () => void;
}

export const SecretVersionHistoryModal: React.FC<SecretVersionHistoryModalProps> = ({
  secretKey,
  project,
  currentVersion,
  onClose,
  onRollbackSuccess,
}) => {
  const [versions, setVersions] = useState<SecretVersionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollbackTarget, setRollbackTarget] = useState<number | null>(null);
  const [rollbackLoading, setRollbackLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSecretVersions(secretKey, project)
      .then((data) => {
        if (!cancelled) setVersions(data || []);
      })
      .catch(() => {
        if (!cancelled) setVersions([]);
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
    <Modal isOpen onClose={onClose} width={520}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--vk-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={16} color="var(--vk-accent)" /> Version History & Rollback
            </h3>
            <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
              Key: <code style={{ color: 'var(--vk-accent)' }}>{secretKey}</code> (Active: v{currentVersion})
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose} aria-label="Close history" style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '28px', color: 'var(--vk-text-muted)', fontSize: '0.85rem' }}>Loading versions...</div>
        ) : versions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px', color: 'var(--vk-text-muted)', fontSize: '0.85rem' }}>
            No previous version history recorded yet.
          </div>
        ) : (
          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {versions.map((item) => {
              const isCurrent = item.version === currentVersion;
              return (
                <div
                  key={item.id || `ver-${item.version}`}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent ? 'var(--vk-surface-2)' : 'var(--vk-surface-1)',
                    border: `1px solid ${isCurrent ? 'var(--vk-border-strong)' : 'var(--vk-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="code-font" style={{ color: isCurrent ? 'var(--vk-accent)' : 'var(--vk-text-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>
                      v{item.version}
                    </span>
                    {isCurrent && <span className="badge badge-write" style={{ fontSize: '0.625rem' }}>CURRENT</span>}
                    <span style={{ color: 'var(--vk-text-muted)', fontSize: '0.775rem' }}>
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  {!isCurrent && (
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.725rem', padding: '4px 8px' }}
                      onClick={() => setRollbackTarget(item.version)}
                    >
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
