import React from 'react';
import type { TeamUser } from '../../lib/api';
import { TableSkeleton } from '../Skeletons';

interface TeamMembersTableProps {
  users: TeamUser[];
  loading: boolean;
  onRemove: (user: TeamUser) => void;
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  users,
  loading,
  onRemove,
}) => {
  return (
    <div className="table-wrap glass">
      <table>
        <thead>
          <tr>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>JOINED</th>
            <th style={{ textAlign: 'right' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={3} cols={4} />}
          {!loading &&
            users.map((u) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--vk-text)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {u.email}
                </td>
                <td>
                  <span className={`badge badge-${u.role === 'write' ? 'write' : u.role === 'admin' ? 'admin' : 'read'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ color: 'var(--vk-text-secondary)', fontSize: '0.8rem' }}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => onRemove(u)}
                    className="btn btn-danger"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--vk-text-muted)', padding: '32px', fontSize: '0.85rem' }}>
                No team members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
