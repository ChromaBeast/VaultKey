import React, { useState, useEffect } from 'react';
import type { Org, SecretItem } from '../lib/api';
import { apiFetch } from '../lib/api';
import { SecretGeneratorModal } from '../components/SecretGeneratorModal';
import { Toast } from '../components/Toast';

export const SecretsPage: React.FC<{ org: Org | null }> = ({ org }) => {
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('default');
  const [projects, setProjects] = useState<string[]>(['default']);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(false);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [revealedVal, setRevealedVal] = useState<{ key: string; val: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' } | null>(null);

  const loadSecrets = async () => {
    try {
      setLoading(true);
      const list = await apiFetch<SecretItem[]>(`/v1/secrets?project=${project}`);
      setSecrets(list || []);
      const projList = await apiFetch<string[]>('/v1/projects');
      setProjects(projList || ['default']);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load secrets', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSecrets(); }, [project]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/v1/secrets', {
        method: 'POST',
        body: JSON.stringify({ key, value, project }),
      });
      setModalOpen(false);
      setKey('');
      setValue('');
      setToast({ message: 'Secret created successfully!', type: 'success' });
      loadSecrets();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleCreateShareLink = async (val: string) => {
    try {
      const res = await apiFetch<{ share_url: string }>('/v1/shares', {
        method: 'POST',
        body: JSON.stringify({ secret: val, max_views: 1, duration: '24h' }),
      });
      const fullUrl = `${window.location.origin}${res.share_url}`;
      setShareUrl(fullUrl);
      setToast({ message: 'Self-destructing link created!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleReveal = async (k: string) => {
    try {
      const res = await apiFetch<{ value: string }>(`/v1/secrets/${k}?project=${project}`);
      setRevealedVal({ key: k, val: res.value });
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleCopy = (k: string, v: string) => {
    navigator.clipboard.writeText(v);
    setCopiedKey(k);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filtered = secrets.filter((s) => s.key.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Vault Secrets</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Encrypted with AES-256-GCM under team master key</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setGenOpen(true)} className="btn btn-secondary">
            🎲 Generator
          </button>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff' }}>
            + Add Secret
          </button>
        </div>
      </div>

      {org?.plan === 'free' && (
        <div className="glass" style={{ padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Free Tier Quota: <strong>{secrets.length} / 25 secrets</strong></span>
          <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (secrets.length / 25) * 100)}%`, height: '100%', background: secrets.length >= 25 ? '#ef4444' : '#6366f1' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input className="input" placeholder="Search secrets..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        <select className="input" value={project} onChange={(e) => setProject(e.target.value)} style={{ maxWidth: '200px' }}>
          {projects.map((p) => (<option key={p} value={p}>{p} project</option>))}
        </select>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>KEY</th><th>PROJECT</th><th>VERSION</th><th>UPDATED</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="code-font" style={{ fontWeight: 600, color: '#e2e8f0' }}>{s.key}</td>
                <td><span className="badge badge-admin">{s.project}</span></td>
                <td>v{s.version}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(s.updated_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleReveal(s.key)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>👁️ Reveal</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>No secrets stored in this project.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <SecretGeneratorModal isOpen={genOpen} onClose={() => setGenOpen(false)} onUseSecret={(sec) => { setValue(sec); setModalOpen(true); }} />

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={handleCreate} className="glass animate-fade" style={{ width: '400px', padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>New Secret</h3>
            <input className="input" placeholder="KEY_NAME" value={key} onChange={(e) => setKey(e.target.value)} required style={{ marginBottom: '12px' }} />
            <textarea className="input" placeholder="Secret Value" value={value} onChange={(e) => setValue(e.target.value)} required style={{ marginBottom: '16px', minHeight: '80px' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Secret</button>
            </div>
          </form>
        </div>
      )}

      {revealedVal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass animate-fade" style={{ width: '440px', padding: '28px', borderRadius: '16px' }}>
            <h3 className="code-font" style={{ marginBottom: '12px', color: '#a855f7' }}>{revealedVal.key}</h3>
            <div className="code-font" style={{ background: '#0e0e0e', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', wordBreak: 'break-all', marginBottom: '16px', color: '#10b981' }}>
              {revealedVal.val}
            </div>
            {shareUrl ? (
              <div style={{ marginBottom: '16px', background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>🔥 Self-Destructing 1-Time Share Link:</div>
                <div className="code-font" style={{ fontSize: '0.8rem', color: '#a855f7', wordBreak: 'break-all' }}>{shareUrl}</div>
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => handleCreateShareLink(revealedVal.val)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                🔗 Create 1-Time Link
              </button>
              <button onClick={() => handleCopy(revealedVal.key, revealedVal.val)} className="btn btn-primary" style={{ background: copiedKey === revealedVal.key ? '#10b981' : '#6366f1' }}>
                {copiedKey === revealedVal.key ? '✓ Copied!' : 'Copy Value'}
              </button>
              <button onClick={() => { setRevealedVal(null); setShareUrl(null); }} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

