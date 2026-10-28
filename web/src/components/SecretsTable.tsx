import React from 'react';
import { FolderPlus } from 'lucide-react';
import type { SecretItem } from '../lib/api';
import { TableSkeleton } from './Skeletons';
import { SecretActions } from './SecretActions';
import { Link } from 'react-router-dom';

interface SecretsTableProps {
  canWrite: boolean;
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
  canWrite,
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
  const filtered = secrets.filter((s) => s.key.toLowerCase().includes(search.trim().toLowerCase()));
  const searching = search.trim().length > 0;

  return (
    <div className="table-wrap glass secrets-table" aria-busy={loading}>
      <table className="w-full">
        <thead>
          <tr>
            <th>KEY NAME</th>
            <th className="secret-secondary">ENVIRONMENT</th>
            <th className="secret-secondary">VERSION</th>
            <th>LAST UPDATED</th>
            <th className="text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={5} cols={5} />}
          {!loading &&
            filtered.map((s) => (
              <tr key={s.id}>
                <td className="max-w-[260px]">
                  <div
                    className="code-font font-semibold text-foreground text-sm truncate secret-key-name"
                    title={s.key}
                  >
                    {s.key.split('_').map((part, i, all) => (<React.Fragment key={i}>{part}{i < all.length - 1 && <>_<wbr /></>}</React.Fragment>))}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono tracking-wider truncate">
                    ••••••••••••••••
                  </div>
                  <details className="secret-mobile-details"><summary>Details</summary><div className="break-all">Key: {s.key}<br />Environment: {s.env || 'default'}<br />Version: v{s.version}</div></details>
                </td>
                <td className="secret-secondary">
                  <span className="text-xs text-muted-foreground">{s.env || 'default'}</span>
                </td>
                <td className="secret-secondary">
                  <span className="code-font text-xs text-muted-foreground" title="Active version">v{s.version}</span>
                </td>
                <td className="text-muted-foreground text-sm">
                  {new Date(s.updated_at).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <SecretActions canWrite={canWrite} item={s} pending={revealPendingKey === s.key} onReveal={onReveal} onHistory={onHistory} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          {!loading && filtered.length === 0 && searching && (
            <tr>
              <td colSpan={5} className="text-center py-14 px-6">
                <h3 className="text-base text-foreground font-bold mb-1.5">
                  No secrets match "{search}"
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try a different search term or select another project.
                </p>
                <button onClick={onClearSearch} className="btn btn-secondary text-xs px-3.5 py-1.5">
                  Clear search
                </button>
              </td>
            </tr>
          )}
          {!loading && secrets.length === 0 && !searching && (
            <tr>
              <td colSpan={5} className="text-center py-14 px-6">
                <div className="w-10 h-10 rounded-full bg-surface-2 inline-flex items-center justify-center mb-3 border border-border">
                  <FolderPlus size={18} className="text-primary" />
                </div>
                <h3 className="text-base text-foreground font-bold mb-1.5">
                  No secrets in "{project}" yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
                  {canWrite ? "Create your first encrypted secret for this project." : "A teammate with write access can add secrets to this project."}
                </p>
                <button hidden={!canWrite} onClick={onCreate} className="btn btn-primary text-sm px-4 py-2">
                  Create First Secret
                </button>
                <p className="mt-4"><Link to="/docs#cli" className="text-sm text-primary hover:text-primary-hover font-medium">Then connect your app with the CLI</Link></p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
