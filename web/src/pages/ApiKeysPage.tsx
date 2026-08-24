import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { APIKeyItem } from '../lib/api';
import { apiFetch, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { StatCard } from '../components/StatCard';
import { TableSkeleton } from '../components/Skeletons';
import { CreateApiKeyModal } from '../components/CreateApiKeyModal';
import { TokenCreatedModal } from '../components/TokenCreatedModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

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
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>API Access Tokens</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
            Scoped authentication keys for CLI, GitHub Actions CI/CD & Go SDK
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <KeyRound size={15} /> Generate API Key
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard icon={<Zap size={21} />} title="Active Tokens" value={activeKeys.length} subtitle="Scoped access" accentColor="#10b981" />
        <StatCard icon={<KeyRound size={20} />} title="Plan Limit" value={org?.plan === 'pro' ? 'Unlimited' : `${activeKeys.length} / 2`} subtitle="Free Tier Limit" accentColor="#8b5cf6" />
        <StatCard icon={<ShieldCheck size={20} />} title="Security" value="HMAC-SHA256" subtitle="Encrypted Tokens" accentColor="#06b6d4" />
      </div>

      <div className="glass table-wrap">
        <table>
          <thead>
            <tr><th>KEY LABEL</th><th>TOKEN ID</th><th>SCOPE</th><th>LAST USED</th><th>CREATED</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton rows={4} cols={7} />}
            {!loading &&
              keys.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>{k.name}</td>
                  <td className="code-font" style={{ color: '#818cf8', fontSize: '0.85rem' }}>{k.id}</td>
                  <td><span className={`badge badge-${k.permissions}`}>{k.permissions}</span></td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(k.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={k.active ? 'badge badge-write' : 'badge badge-danger'}>
                      {k.active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td>
                    {k.active && (
                      <button onClick={() => setRevokeTarget(k)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {!loading && keys.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>No API keys generated yet.</td></tr>
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
        message={`Any CLI, CI pipeline, or SDK using "${revokeTarget?.name ?? ''}" will immediately lose access.`}
        confirmLabel="Revoke Key"
        danger
        loading={revokeLoading}
        onConfirm={() => void handleRevoke()}
        onClose={() => setRevokeTarget(null)}
      />
    </div>
  );
};
