import React from 'react';
import type { TeamUser } from '../../lib/api';
import { isAdminRole } from '../../lib/permissions';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  return (
    <div className="table-wrap team-members-table">
      <table className="w-full">
        <thead>
          <tr>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>JOINED</th>
            <th className="text-right">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={3} cols={4} />}
          {!loading &&
            users.map((u) => (
              <tr key={u.id}>
                <td className="text-foreground text-sm font-medium">
                  {u.email}
                </td>
                <td>
                  <span className={`badge badge-${u.role === 'write' ? 'write' : isAdminRole(u.role) ? 'admin' : 'read'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-muted-foreground text-xs">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="text-right">
                  <button
                    disabled={u.id === user?.id || u.role === "owner"}
                    title={u.role === "owner" ? "The workspace owner cannot be removed" : u.id === user?.id ? "You cannot remove yourself" : undefined}
                    onClick={() => onRemove(u)}
                    className="btn btn-danger text-xs px-2.5 py-1"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-muted-foreground py-8 text-xs">
                No team members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
