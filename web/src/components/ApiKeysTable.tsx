import React from 'react';
import { Bot, Plus } from 'lucide-react';
import type { APIKeyItem } from '../lib/api';
import { TableSkeleton } from './Skeletons';

interface ApiKeysTableProps {
  keys: APIKeyItem[];
  loading: boolean;
  checkedAt: number;
  onRevoke: (key: APIKeyItem) => void;
  onConnect: () => void;
  onCreate: () => void;
}

export const ApiKeysTable: React.FC<ApiKeysTableProps> = ({ keys, loading, checkedAt, onRevoke, onConnect, onCreate }) => (
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
            keys.map((k) => (
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
                      onClick={() => onRevoke(k)}
                      className="btn btn-danger text-xs px-2.5 py-1"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          {!loading && keys.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-12 px-6 text-muted-foreground">
                <h2 className="text-base font-semibold text-foreground">Connect your first application</h2>
                <p className="mt-1.5 mb-4 text-xs text-muted-foreground">Create a scoped API key for your CLI or automation.</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button className="btn btn-secondary whitespace-nowrap" onClick={onConnect}>
                    <Bot size={14} /> Connect Agent
                  </button>
                  <button className="btn btn-primary whitespace-nowrap" onClick={onCreate}>
                    <Plus size={14} /> Create API Key
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
);
