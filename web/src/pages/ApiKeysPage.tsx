import React, { useState, useEffect } from 'react';
import type { APIKeyItem, Org } from '../lib/api';
import { apiFetch } from '../lib/api';

export const ApiKeysPage: React.FC<{ org: Org | null }> = ({ org }) => {
  const [keys, setKeys] = useState<APIKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('read');
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ token: string }>('/v1/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name, permissions }),
      });
      setCreatedToken(res.token);
      setModalOpen(false);
      setName('');
      loadKeys();
    } catch (err: any) {
      alert(err.message);
    }
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

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>API Access Keys</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Scoped authentication tokens for CLI, CI/CD, and SDK integration</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: '#fff' }}>
          + Generate New API Key
        </button>
      </div>

      {org?.plan === 'free' && (
        <div className="glass" style={{ padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Free Tier Limit: <strong>{keys.filter(k => k.active).length} / 2 API Keys</strong></span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Upgrade to Pro for unlimited team tokens</span>
        </div>
      )}

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>KEY NAME</th><th>KEY ID</th><th>PERMISSIONS</th><th>LAST USED</th><th>CREATED</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{k.name}</td>
                <td className="code-font" style={{ color: '#a855f7' }}>{k.id}</td>
                <td><span className={`badge badge-${k.permissions}`}>{k.permissions}</span></td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(k.created_at).toLocaleDateString()}</td>
                <td>
                  <span style={{ color: k.active ? '#10b981' : '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                    {k.active ? '● Active' : '○ Revoked'}
                  </span>
                </td>
                <td>
                  {k.active && (
                    <button onClick={() => handleRevoke(k.id)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f87171' }}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {keys.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>No API keys generated yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={handleCreate} className="glass animate-fade" style={{ width: '400px', padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>Generate API Key</h3>
            <input className="input" placeholder="Key Label (e.g. GitHub Actions CI)" value={name} onChange={(e) => setName(e.target.value)} required style={{ marginBottom: '12px' }} />
            <select className="input" value={permissions} onChange={(e) => setPermissions(e.target.value)} style={{ marginBottom: '16px' }}>
              <option value="read">Read Only</option>
              <option value="write">Read & Write</option>
              <option value="admin">Full Admin</option>
            </select>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Generate Token</button>
            </div>
          </form>
        </div>
      )}

      {createdToken && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass animate-fade" style={{ width: '440px', padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '8px', color: '#10b981' }}>🔑 API Key Generated!</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '14px' }}>
              Copy this token now. For security reasons, it will never be shown again!
            </p>
            <div className="code-font" style={{ background: '#0e0e0e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', wordBreak: 'break-all', marginBottom: '16px', color: '#6366f1' }}>
              {createdToken}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={copyToken} className="btn btn-primary" style={{ background: copied ? '#10b981' : '#6366f1' }}>
                {copied ? '✓ Copied Token!' : 'Copy Token'}
              </button>
              <button onClick={() => setCreatedToken(null)} className="btn btn-secondary">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
