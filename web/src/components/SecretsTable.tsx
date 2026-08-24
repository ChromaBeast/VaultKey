import React from 'react';
import { Eye, History, Pencil, Trash2 } from 'lucide-react';
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
    <div className="glass table-wrap">
      <table style={{ width: '100%', minWidth: '700px' }}>
        <thead>
          <tr><th>KEY NAME</th><th>PROJECT</th><th>VERSION</th><th>LAST UPDATED</th><th>ACTIONS</th></tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={5} cols={5} />}
          {!loading &&
            filtered.map((s) => (
              <tr key={s.id}>
                <td
                  className="code-font"
                  style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.925rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={s.key}
                >
                  {s.key}
                </td>
                <td><span className="badge badge-read">{s.project}</span></td>
                <td>
                  <span className="code-font version-chip" title="Active version">v{s.version}</span>
                </td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(s.updated_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onReveal(s.key)}
                      disabled={revealPendingKey === s.key}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      {revealPendingKey === s.key ? <span className="icon-spin"><Eye size={14} /></span> : <Eye size={14} />}
                      Reveal
                    </button>
                    <button onClick={() => onHistory(s)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <History size={14} /> History
                    </button>
                    <button onClick={() => onEdit(s)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => onDelete(s)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          {!loading && filtered.length === 0 && searching && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '56px 24px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  No results for "{search}"
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '16px' }}>
                  No secret keys in this project match your search.
                </p>
                <button onClick={onClearSearch} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Clear search
                </button>
              </td>
            </tr>
          )}
          {!loading && secrets.length === 0 && !searching && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '56px 24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
                  No secrets stored in "{project}"
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '360px', margin: '0 auto 20px' }}>
                  Secrets are encrypted using AES-256-GCM under your derived master key before storage.
                </p>
                <button onClick={onCreate} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
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
