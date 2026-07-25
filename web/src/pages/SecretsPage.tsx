import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SecretItem } from '../lib/api';
import { apiFetch } from '../lib/api';
import { SecretGeneratorModal } from '../components/SecretGeneratorModal';
import { Toast } from '../components/Toast';
import { BentoGridMetrics } from '../components/BentoGridMetrics';
import { CreateSecretModal } from '../components/CreateSecretModal';
import { RevealSecretModal } from '../components/RevealSecretModal';
import { SecretVersionHistoryModal } from '../components/SecretVersionHistoryModal';
import { CommandPaletteModal } from '../components/CommandPaletteModal';

export const SecretsPage: React.FC = () => {
  const { org } = useAuth();
  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('default');
  const [projects, setProjects] = useState<string[]>(['default']);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState<{ key: string; version: number } | null>(null);
  const [revealedVal, setRevealedVal] = useState<{ key: string; val: string } | null>(null);
  const [copied, setCopied] = useState(false);
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

  const handleCreateSecret = async (key: string, value: string) => {
    try {
      await apiFetch('/v1/secrets', {
        method: 'POST',
        body: JSON.stringify({ key, value, project }),
      });
      setModalOpen(false);
      setToast({ message: 'Secret encrypted & stored successfully!', type: 'success' });
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
      setShareUrl(`${window.location.origin}${res.share_url}`);
      setToast({ message: '1-Time Self-Destructing link created!', type: 'success' });
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

  const filtered = secrets.filter((s) => s.key.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Vault Secrets</h1>
            {org && (
              <span className="badge badge-admin">
                {org.plan === 'free' ? `${secrets.length}/25 Used` : 'Pro Unlimited'}
              </span>
            )}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
            Zero-trust end-to-end encrypted under team master key (AES-256-GCM)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setGenOpen(true)} className="btn btn-secondary">🎲 Generator</button>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">+ New Secret</button>
        </div>
      </div>

      <BentoGridMetrics
        totalSecrets={secrets.length}
        activeProject={project}
        projectCount={projects.length}
        onOpenCmdPalette={() => setCmdOpen(true)}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <input
          className="input"
          placeholder="🔍 Search secrets... (⌘K for command palette)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '380px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Project:</span>
          <select className="input" value={project} onChange={(e) => setProject(e.target.value)} style={{ width: '180px' }}>
            {projects.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
        </div>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>KEY NAME</th><th>PROJECT</th><th>VERSION</th><th>LAST UPDATED</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="code-font" style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>{s.key}</td>
                <td><span className="badge badge-admin">{s.project}</span></td>
                <td>
                  <span
                    onClick={() => setHistoryItem({ key: s.key, version: s.version })}
                    className="code-font"
                    style={{ color: '#c084fc', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none' }}
                    title="View Version History & Rollback"
                  >
                    v{s.version} 📜
                  </span>
                </td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(s.updated_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleReveal(s.key)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      👁️ Reveal
                    </button>
                    <button onClick={() => setHistoryItem({ key: s.key, version: s.version })} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      ↩️ Rollback
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>No secrets stored in project "{project}".</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <SecretGeneratorModal isOpen={genOpen} onClose={() => setGenOpen(false)} onUseSecret={() => setModalOpen(true)} />
      <CreateSecretModal isOpen={modalOpen} project={project} onClose={() => setModalOpen(false)} onSubmit={handleCreateSecret} onOpenGenerator={() => setGenOpen(true)} />
      <CommandPaletteModal isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onOpenCreateSecret={() => setModalOpen(true)} />
      {historyItem && (
        <SecretVersionHistoryModal
          secretKey={historyItem.key}
          project={project}
          currentVersion={historyItem.version}
          isOpen={!!historyItem}
          onClose={() => setHistoryItem(null)}
          onRollbackSuccess={loadSecrets}
        />
      )}
      {revealedVal && (
        <RevealSecretModal
          secretKey={revealedVal.key}
          secretVal={revealedVal.val}
          shareUrl={shareUrl}
          copied={copied}
          onClose={() => { setRevealedVal(null); setShareUrl(null); }}
          onCopy={() => { navigator.clipboard.writeText(revealedVal.val); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          onCreateShareLink={handleCreateShareLink}
        />
      )}
    </div>
  );
};
