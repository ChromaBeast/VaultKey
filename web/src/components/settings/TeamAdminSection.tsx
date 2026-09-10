import React, { useEffect, useState } from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';
import type { TeamUser } from '../../lib/api';
import { deleteUser, errorMessage, fetchUsers, inviteUser } from '../../lib/api';
import { pushToast } from '../../lib/toast';
import { TableSkeleton } from '../Skeletons';
import { ConfirmDialog } from '../ConfirmDialog';

export const TeamAdminSection: React.FC = () => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('read');
  const [inviting, setInviting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
      const res = await inviteUser({ email: email.trim(), role });
      const fullUrl = `${window.location.origin}${res.invite_url}`;
      setInviteUrl(fullUrl);
      pushToast(`One-time invite link generated for ${res.email}`, 'success');
      setEmail('');
      setRole('read');
      void loadUsers();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to invite user'), 'error');
    } finally {
      setInviting(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      pushToast('Invite link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      pushToast('Failed to copy to clipboard', 'error');
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
        <div style={{ flex: '1 1 240px' }}>
          <label htmlFor="invite-email" style={labelStyle}>Email Address</label>
          <input id="invite-email" type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" />
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
          <UserPlus size={15} /> {inviting ? 'Generating...' : 'Create Invite Link'}
        </button>
      </form>

      {inviteUrl && (
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(94, 231, 255, 0.06)',
            border: '1px solid rgba(94, 231, 255, 0.25)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5ee7ff' }}>
              One-Time Invite Link Generated
            </span>
            <button
              onClick={() => setInviteUrl(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Dismiss
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
            Share this secure link with the teammate. They will set their own password upon opening it.
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="input"
              style={{ flex: 1, fontSize: '0.8rem', fontFamily: 'monospace', padding: '6px 10px' }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

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
