import React, { useEffect, useState } from 'react';
import type { SecretVersionItem } from '../lib/api';
import { fetchSecretVersions, rollbackSecretVersion } from '../lib/api';

interface SecretVersionHistoryModalProps {
  secretKey: string;
  project: string;
  currentVersion: number;
  isOpen: boolean;
  onClose: () => void;
  onRollbackSuccess: () => void;
}

export const SecretVersionHistoryModal: React.FC<SecretVersionHistoryModalProps> = ({
  secretKey,
  project,
  currentVersion,
  isOpen,
  onClose,
  onRollbackSuccess,
}) => {
  const [versions, setVersions] = useState<SecretVersionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollbackLoading, setRollbackLoading] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && secretKey) {
      setLoading(true);
      fetchSecretVersions(secretKey, project)
        .then((data) => setVersions(data || []))
        .catch(() => setVersions([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, secretKey, project]);

  if (!isOpen) return null;

  const handleRollback = async (ver: number) => {
    if (!confirm(`Are you sure you want to rollback ${secretKey} to version v${ver}?`)) {
      return;
    }

    setRollbackLoading(ver);
    try {
      await rollbackSecretVersion(secretKey, project, ver);
      alert(`🎉 Secret ${secretKey} successfully rolled back! Current version incremented.`);
      onRollbackSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Rollback failed');
    } finally {
      setRollbackLoading(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        style={{ width: '100%', maxWidth: '540px', padding: '24px', borderRadius: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Version History & Rollback
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Key: <code style={{ color: '#818cf8' }}>{secretKey}</code> (Active: v{currentVersion})
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '4px 10px' }}>
            ✕
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
                  disabled={rollbackLoading === item.version}
                  onClick={() => handleRollback(item.version)}
                >
                  {rollbackLoading === item.version ? 'Rolling back...' : '↩️ Rollback to v' + item.version}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
