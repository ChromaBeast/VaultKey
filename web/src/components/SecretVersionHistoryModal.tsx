import React, { useEffect, useState } from 'react';
import { History } from 'lucide-react';
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
    <Modal isOpen onClose={onClose} width={540}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={17} color="#c084fc" /> Version History & Rollback
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Key: <code style={{ color: '#818cf8' }}>{secretKey}</code> (Active: v{currentVersion})
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose} aria-label="Close history" style={{ padding: '4px 10px' }}>
            x
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Loading versions...</div>
        ) : versions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
            No previous version history recorded yet for this key.
          </div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {versions.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span className="code-font" style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.9rem' }}>
                    v{item.version}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '12px' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => setRollbackTarget(item.version)}
                >
                  Rollback to v{item.version}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={rollbackTarget !== null}
        title={`Rollback ${secretKey}?`}
        message={`The active value will be replaced with the contents of v${rollbackTarget}. A new version entry is appended to the audit chain.`}
        confirmLabel="Rollback"
        danger
        loading={rollbackLoading}
        onConfirm={handleRollback}
        onClose={() => setRollbackTarget(null)}
      />
    </Modal>
  );
};
