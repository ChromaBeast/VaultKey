import React, { useState } from 'react';
import { Bot, Plus, KeyRound } from 'lucide-react';
import { isAdminRole } from '../lib/permissions';
import { useAuth } from '../context/AuthContext';
import type { APIKeyItem } from '../lib/api';
import { apiFetch, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { ApiKeysTable } from '../components/ApiKeysTable';
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
  if (!isAdmin) return <div><PageHeader title="API Keys" icon={<KeyRound size={20} />} tone="violet" description="An administrator manages automation keys for this workspace." /></div>;
  return (
    <div className="animate-fade">
      <PageHeader
        title="API Keys" icon={<KeyRound size={20} />} tone="violet"
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
        <ApiKeysTable
          keys={automationKeys}
          loading={loading}
          checkedAt={checkedAt}
          onRevoke={setRevokeTarget}
          onConnect={() => { setConnectToken(null); setConnectModalOpen(true); }}
          onCreate={() => setModalOpen(true)}
        />
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
