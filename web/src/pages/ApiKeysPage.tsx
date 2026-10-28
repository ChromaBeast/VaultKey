import React, { useState } from 'react';
import { Bot, Plus } from 'lucide-react';
import { isAdminRole } from '../lib/permissions';
import { useAuth } from '../context/AuthContext';
import type { APIKeyItem } from '../lib/api';
import { apiFetch, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { TableSkeleton } from '../components/Skeletons';
import { CreateApiKeyModal } from '../components/CreateApiKeyModal';
import { TokenCreatedModal } from '../components/TokenCreatedModal';
import { ConnectAgentModal } from '../components/ConnectAgentModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageHeader } from '../components/ui/PageHeader';
export const ApiKeysPage: React.FC = () => {
  const { org, user } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [checkedAt, setCheckedAt] = useState(Date.now);
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<APIKeyItem | null>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const loadKeys = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await apiFetch<APIKeyItem[]>('/v1/api-keys');
      setCheckedAt(Date.now());
      setKeys(list || []);
    } catch (err) {
      setLoadError(errorMessage(err, 'Failed to load API keys'));
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    apiFetch<APIKeyItem[]>('/v1/api-keys')
      .then((list) => {
        if (active) { setCheckedAt(Date.now()); setKeys(list || []); }
      })
      .catch((err) => {
        if (active) setLoadError(errorMessage(err, 'Failed to load API keys'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);
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
  const activeKeys = keys.filter((k) => k.active && !k.name.startsWith("Session: ") && (!k.expires_at || Date.parse(k.expires_at) > checkedAt));
  const automationKeys = keys.filter((k) => !k.name.startsWith("Session: "));
  if (!isAdmin) return <div><PageHeader title="API Keys" description="An administrator manages automation keys for this workspace." /></div>;
  return (
    <div className="animate-fade">
      <PageHeader
        title="API Keys"
        description="Scoped tokens for automation."
        badge={
          <span className="app-page-meta">
            {org?.plan !== 'free' ? 'Pro Plan: Unlimited' : `Quota: ${activeKeys.length} / 2 active tokens`}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => { setConnectToken(null); setConnectModalOpen(true); }} className="btn btn-secondary">
              <Bot size={14} /> Connect Agent
            </button>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary">
              <Plus size={14} /> Create API Key
            </button>
          </div>
        }
      />
      {loadError ? (
        <div className="load-error" role="alert">
          <div>
            <h2>Could not load API keys</h2>
            <p>{loadError}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => void loadKeys()}>Retry</button>
        </div>
      ) : (
        <div className="table-wrap glass api-keys-table mt-5">
          <table className="w-full">
            <thead>
              <tr>
                <th>KEY LABEL</th>
                <th>SCOPE</th>
                <th>LAST USED</th>
                <th>STATUS</th>
                <th className="text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading && <TableSkeleton rows={4} cols={5} />}
              {!loading &&
                automationKeys.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <div className="font-semibold text-foreground text-sm">{k.name}</div>
                      <div className="code-font text-xs text-muted-foreground mt-0.5">
                        {k.id}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${k.permissions}`}>{k.permissions}</span>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}
                    </td>
                    <td>
                      <span className={k.active ? 'badge badge-write' : 'badge badge-danger'}>
                        {!k.active ? 'Revoked' : k.expires_at && Date.parse(k.expires_at) <= checkedAt ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="text-right">
                      {k.active && (
                        <button
                          onClick={() => setRevokeTarget(k)}
                          className="btn btn-danger text-xs px-2.5 py-1"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              {!loading && automationKeys.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 px-6 text-muted-foreground">
                    <h2 className="text-base font-semibold text-foreground">Connect your first application</h2>
                    <p className="mt-1.5 mb-4 text-xs text-muted-foreground">Create a scoped API key for your CLI or automation.</p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button className="btn btn-secondary whitespace-nowrap" onClick={() => { setConnectToken(null); setConnectModalOpen(true); }}>
                        <Bot size={14} /> Connect Agent
                      </button>
                      <button className="btn btn-primary whitespace-nowrap" onClick={() => setModalOpen(true)}>
                        <Plus size={14} /> Create API Key
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && (
        <CreateApiKeyModal
          isOpen
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateKey}
          submitting={creating}
        />
      )}
      {createdToken && (
        <TokenCreatedModal
          createdToken={createdToken}
          onClose={() => setCreatedToken(null)}
          onConnectAgent={() => {
            setConnectToken(createdToken);
            setConnectModalOpen(true);
          }}
        />
      )}
      <ConnectAgentModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        token={connectToken}
      />
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
