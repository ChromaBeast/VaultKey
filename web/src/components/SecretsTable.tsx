import React from 'react';
import { Eye, History, Pencil, Trash2, FolderPlus } from 'lucide-react';
import type { SecretItem } from '../lib/api';
import { TableSkeleton } from './Skeletons';

interface SecretsTableProps {
  secrets: SecretItem[];
  loading: boolean;
  search: string;
  project: string;
  revealPendingKey: string | null;
  onReveal: (key: string) => void;
  onHistory: (item: SecretItem) => void;
  onEdit: (item: SecretItem) => void;
  onDelete: (item: SecretItem) => void;
  onCreate: () => void;
  onClearSearch: () => void;
}

export const SecretsTable: React.FC<SecretsTableProps> = ({
  secrets,
  loading,
  search,
  project,
  revealPendingKey,
  onReveal,
  onHistory,
  onEdit,
  onDelete,
  onCreate,
  onClearSearch,
}) => {
  const filtered = secrets.filter((s) => s.key.toLowerCase().includes(search.toLowerCase()));
  const searching = search.trim().length > 0;

  return (
    <div className="table-wrap glass">
      <table style={{ width: '100%', minWidth: '720px' }}>
        <thead>
          <tr>
            <th>KEY NAME</th>
            <th>ENVIRONMENT</th>
            <th>VERSION</th>
            <th>LAST UPDATED</th>
            <th style={{ textAlign: 'right' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={5} cols={5} />}
          {!loading &&
            filtered.map((s) => (
              <tr key={s.id}>
                <td style={{ maxWidth: '260px' }}>
                  <div
                    className="code-font"
                    style={{ fontWeight: 600, color: 'var(--vk-text)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={s.key}
                  >
                    {s.key}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>
                    ••••••••••••••••
                  </div>
                </td>
                <td>
                  <span className="badge badge-read" style={{ fontSize: '0.68rem' }}>{s.project}</span>
                </td>
                <td>
                  <span className="version-chip code-font" title="Active version">v{s.version}</span>
                </td>
                <td style={{ color: 'var(--vk-text-secondary)', fontSize: '0.8rem' }}>
                  {new Date(s.updated_at).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onReveal(s.key)}
                      disabled={revealPendingKey === s.key}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      title="Decrypt in RAM"
                    >
                      <Eye size={13} />
                      {revealPendingKey === s.key ? 'Decrypting...' : 'Reveal'}
                    </button>
                    <button
                      onClick={() => onHistory(s)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      title="Version history & rollback"
                    >
                      <History size={13} /> History
                    </button>
                    <button
                      onClick={() => onEdit(s)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      title="Update secret value"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      title="Delete secret"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          {!loading && filtered.length === 0 && searching && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '56px 24px' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--vk-text)', fontWeight: 700, marginBottom: '6px' }}>
                  No secrets match "{search}"
                </h3>
                <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Try a different search term or select another environment.
                </p>
                <button onClick={onClearSearch} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Clear search
                </button>
              </td>
            </tr>
          )}
          {!loading && secrets.length === 0 && !searching && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--vk-surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '1px solid var(--vk-border)' }}>
                  <FolderPlus size={18} color="var(--vk-accent)" />
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--vk-text)', fontWeight: 700, marginBottom: '6px' }}>
                  No secrets in "{project}" yet
                </h3>
                <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 18px' }}>
                  Create your first encrypted secret for this environment. Encrypted under team master key before storage.
                </p>
                <button onClick={onCreate} className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                  Create First Secret
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
