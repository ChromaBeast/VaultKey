import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { APIKeyItem } from '../lib/api';
import { apiFetch } from '../lib/api';
import { StatCard } from '../components/StatCard';
import { CreateApiKeyModal } from '../components/CreateApiKeyModal';
import { TokenCreatedModal } from '../components/TokenCreatedModal';

export const ApiKeysPage: React.FC = () => {
  const { org } = useAuth();
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const list = await apiFetch<APIKeyItem[]>('/v1/api-keys');
      setKeys(list || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadKeys(); }, []);

  const handleCreateKey = async (name: string, permissions: string) => {
    const res = await apiFetch<{ token: string }>('/v1/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, permissions }),
    });
    setCreatedToken(res.token);
    setModalOpen(false);
    loadKeys();
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;
    try {
      await apiFetch(`/v1/api-keys/${id}`, { method: 'DELETE' });
      loadKeys();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyToken = () => {
    if (createdToken) {
      navigator.clipboard.writeText(createdToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeKeys = keys.filter(k => k.active);

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>API Access Tokens</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
            Scoped authentication keys for CLI, GitHub Actions CI/CD & Go SDK
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          + Generate API Key
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard icon="⚡" title="Active Tokens" value={activeKeys.length} subtitle="Scoped access" accentColor="#10b981" />
        <StatCard icon="🛡️" title="Plan Limit" value={org?.plan === 'pro' ? 'Unlimited' : `${activeKeys.length} / 2`} subtitle="Free Tier Limit" accentColor="#8b5cf6" />
        <StatCard icon="🔒" title="Security" value="HMAC-SHA256" subtitle="Encrypted Tokens" accentColor="#06b6d4" />
      </div>

      {/* Keys Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>KEY LABEL</th><th>TOKEN ID</th><th>SCOPE</th><th>LAST USED</th><th>CREATED</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>{k.name}</td>
                <td className="code-font" style={{ color: '#818cf8', fontSize: '0.85rem' }}>{k.id}</td>
                <td><span className={`badge badge-${k.permissions}`}>{k.permissions}</span></td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(k.created_at).toLocaleDateString()}</td>
                <td>
                  <span style={{ color: k.active ? '#34d399' : '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                    {k.active ? '● Active' : '○ Revoked'}
                  </span>
                </td>
                <td>
                  {k.active && (
                    <button onClick={() => handleRevoke(k.id)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {keys.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>No API keys generated yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreateApiKeyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateKey} />
      <TokenCreatedModal createdToken={createdToken} copied={copied} onCopy={copyToken} onClose={() => setCreatedToken(null)} />
    </div>
  );
};
