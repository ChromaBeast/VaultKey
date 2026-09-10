import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Zap, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { APIKeyItem } from '../lib/api';
import { apiFetch, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { StatCard } from '../components/StatCard';
import { TableSkeleton } from '../components/Skeletons';
import { CreateApiKeyModal } from '../components/CreateApiKeyModal';
import { TokenCreatedModal } from '../components/TokenCreatedModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageHeader } from '../components/ui/PageHeader';

export const ApiKeysPage: React.FC = () => {
  const { org } = useAuth();
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<APIKeyItem | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const list = await apiFetch<APIKeyItem[]>('/v1/api-keys');
      setKeys(list || []);
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to load API keys'), 'error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let active = true;
    apiFetch<APIKeyItem[]>('/v1/api-keys')
      .then((list) => {
        if (active) setKeys(list || []);
      })
      .catch((err) => {
        if (active) pushToast(errorMessage(err, 'Failed to load API keys'), 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreateKey = async (name: string, permissions: string) => {
    if (creating) return;
    setCreating(true);
    try {
      const res = await apiFetch<{ token: string }>('/v1/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name, permissions }),
      });
      setCreatedToken(res.token);
      setModalOpen(false);
      void loadKeys();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to create API key'), 'error');
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevokeLoading(true);
    try {
      await apiFetch(`/v1/api-keys/${encodeURIComponent(revokeTarget.id)}`, { method: 'DELETE' });
      pushToast(`API key "${revokeTarget.name}" revoked`, 'success');
      setRevokeTarget(null);
      void loadKeys();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to revoke key'), 'error');
    } finally {
      setRevokeLoading(false);
    }
  };

  const activeKeys = keys.filter((k) => k.active);

  return (
    <div className="animate-fade">
      <PageHeader
        breadcrumb="MACHINE ACCESS"
        title="API Keys"
        description="Scoped credentials for CLI, GitHub Actions CI/CD pipelines, and SDK integrations."
        actions={
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <Plus size={14} /> Create API Key
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <StatCard icon={<Zap size={18} />} title="Active Tokens" value={activeKeys.length} subtitle="Scoped access" accentColor="var(--vk-success)" />
        <StatCard icon={<KeyRound size={18} />} title="Plan Quota" value={org?.plan === 'pro' ? 'Unlimited' : `${activeKeys.length} / 2`} subtitle="Current Tier Limit" accentColor="var(--vk-accent)" />
        <StatCard icon={<ShieldCheck size={18} />} title="Security Model" value="HMAC-SHA256" subtitle="Cryptographically Hashed" accentColor="var(--vk-accent-secondary)" />
      </div>

      <div className="table-wrap glass">
        <table>
          <thead>
            <tr>
              <th>KEY LABEL</th>
              <th>TOKEN PREFIX</th>
              <th>SCOPE</th>
              <th>LAST USED</th>
              <th>CREATED</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton rows={4} cols={7} />}
            {!loading &&
              keys.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 600, color: 'var(--vk-text)', fontSize: '0.875rem' }}>{k.name}</td>
                  <td className="code-font" style={{ color: 'var(--vk-accent)', fontSize: '0.8rem' }}>{k.id}</td>
                  <td>
                    <span className={`badge badge-${k.permissions}`}>{k.permissions}</span>
                  </td>
                  <td style={{ color: 'var(--vk-text-secondary)', fontSize: '0.8rem' }}>
                    {k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}
                  </td>
                  <td style={{ color: 'var(--vk-text-secondary)', fontSize: '0.8rem' }}>
                    {new Date(k.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={k.active ? 'badge badge-write' : 'badge badge-danger'}>
                      {k.active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {k.active && (
                      <button onClick={() => setRevokeTarget(k)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {!loading && keys.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--vk-text-muted)', padding: '48px' }}>
                  No machine access tokens generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CreateApiKeyModal
          isOpen
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateKey}
          submitting={creating}
        />
      )}
      {createdToken && <TokenCreatedModal createdToken={createdToken} onClose={() => setCreatedToken(null)} />}
      <ConfirmDialog
        isOpen={revokeTarget !== null}
        title="Revoke API key?"
        message={`Any automated workflow, CI/CD pipeline, or CLI session using "${revokeTarget?.name ?? ''}" will immediately lose access.`}
        confirmLabel="Revoke Key"
        danger
        loading={revokeLoading}
        onConfirm={() => void handleRevoke()}
        onClose={() => setRevokeTarget(null)}
      />
    </div>
  );
};
