import React, { useEffect, useState } from 'react';
import type { TeamUser } from '../../lib/api';
import { deleteUser, errorMessage, fetchUsers } from '../../lib/api';
import { pushToast } from '../../lib/toast';
import { ConfirmDialog } from '../ConfirmDialog';
import { InviteUserForm } from './InviteUserForm';
import { TeamMembersTable } from './TeamMembersTable';

export const TeamAdminSection: React.FC = () => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<TeamUser | null>(null);
  const [removing, setRemoving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await fetchUsers();
      setUsers(list || []);
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to load team members'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchUsers()
      .then((list) => {
        if (active) setUsers(list || []);
      })
      .catch((err) => {
        if (active) pushToast(errorMessage(err, 'Failed to load team members'), 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await deleteUser(removeTarget.id);
      pushToast(`Removed ${removeTarget.email}`, 'success');
      setRemoveTarget(null);
      void loadUsers();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to remove user'), 'error');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <InviteUserForm onUserInvited={() => void loadUsers()} />
      <TeamMembersTable users={users} loading={loading} onRemove={setRemoveTarget} />

      <ConfirmDialog
        isOpen={removeTarget !== null}
        title="Remove team member?"
        message={`${removeTarget?.email ?? ''} will immediately lose access to this organization's encrypted vault.`}
        confirmLabel="Remove User"
        danger
        loading={removing}
        onConfirm={() => void handleRemove()}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
};
