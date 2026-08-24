import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { TeamUser } from '../../lib/api';
import { deleteUser, errorMessage, fetchUsers, inviteUser } from '../../lib/api';
import { pushToast } from '../../lib/toast';
import { TableSkeleton } from '../Skeletons';
import { ConfirmDialog } from '../ConfirmDialog';

export const TeamAdminSection: React.FC = () => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('read');
  const [inviting, setInviting] = useState(false);
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


  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviting) return;
    setInviting(true);
    try {
      const created = await inviteUser({ email: email.trim(), password, role });
      pushToast(`Invitation created for ${created.email} (${created.role})`, 'success');
      setEmail('');
      setPassword('');
      setRole('read');
      void loadUsers();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to invite user'), 'error');
    } finally {
      setInviting(false);
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <form onSubmit={(e) => void handleInvite(e)} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="invite-email" style={labelStyle}>Email</label>
          <input id="invite-email" type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label htmlFor="invite-password" style={labelStyle}>Initial Password</label>
          <input id="invite-password" type="text" className="input" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
        </div>
        <div style={{ width: '130px' }}>
          <label htmlFor="invite-role" style={labelStyle}>Role</label>
          <select id="invite-role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="read">read</option>
            <option value="write">write</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={inviting}>
          <UserPlus size={15} /> {inviting ? 'Inviting...' : 'Invite'}
        </button>
      </form>

      <div className="glass table-wrap">
        <table>
          <thead>
            <tr><th>EMAIL</th><th>ROLE</th><th>CREATED</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton rows={3} cols={4} />}
            {!loading &&
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 500 }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'write' ? 'write' : u.role === 'admin' ? 'admin' : 'read'}`}>{u.role}</span></td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '\u2014'}</td>
                  <td>
                    <button onClick={() => setRemoveTarget(u)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px', fontSize: '0.875rem' }}>No team members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={removeTarget !== null}
        title="Remove team member?"
        message={`${removeTarget?.email ?? ''} will immediately lose access to this organization's vault.`}
        confirmLabel="Remove User"
        danger
        loading={removing}
        onConfirm={() => void handleRemove()}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#cbd5e1',
  marginBottom: '6px',
};
