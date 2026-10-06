import React from 'react';
import { FolderPlus } from 'lucide-react';
import type { SecretItem } from '../lib/api';
import { TableSkeleton } from './Skeletons';
import { SecretActions } from './SecretActions';
import { Link } from 'react-router-dom';

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
    <div className="table-wrap glass secrets-table" aria-busy={loading}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>KEY NAME</th>
            <th className="secret-secondary">ENVIRONMENT</th>
            <th className="secret-secondary">VERSION</th>
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    ••••••••••••••••
                  </div>
                  <details className="secret-mobile-details"><summary>Details</summary><div className="break-all">Key: {s.key}<br />Environment: {s.env || 'default'}<br />Version: v{s.version}</div></details>
                </td>
                <td className="secret-secondary">
                  <span className="badge badge-neutral">{s.env || 'default'}</span>
                </td>
                <td className="secret-secondary">
                  <span className="version-chip code-font" title="Active version">v{s.version}</span>
                </td>
                <td style={{ color: 'var(--vk-text-secondary)', fontSize: '0.875rem' }}>
                  {new Date(s.updated_at).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <SecretActions item={s} pending={revealPendingKey === s.key} onReveal={onReveal} onHistory={onHistory} onEdit={onEdit} onDelete={onDelete} />
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
                  Try a different search term or select another project.
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
                  Create your first encrypted secret for this project.
                </p>
                <button onClick={onCreate} className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                  Create First Secret
                </button>
                <p className="mt-4"><Link to="/docs#cli" className="text-sm text-primary hover:underline">Then connect your app with the CLI</Link></p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
