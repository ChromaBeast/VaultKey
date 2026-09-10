import React, { useState } from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';
import { inviteUser, errorMessage } from '../../lib/api';
import { pushToast } from '../../lib/toast';

interface InviteUserFormProps {
  onUserInvited: () => void;
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({ onUserInvited }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('read');
  const [inviting, setInviting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      onUserInvited();
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
      <form onSubmit={(e) => void handleInvite(e)} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 240px' }}>
          <label htmlFor="invite-email" style={labelStyle}>Email Address</label>
          <input
            id="invite-email"
            type="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
          />
        </div>
        <div style={{ width: '130px' }}>
          <label htmlFor="invite-role" style={labelStyle}>Role</label>
          <select id="invite-role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="read">Read Only</option>
            <option value="write">Read & Write</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={inviting}>
          <UserPlus size={14} /> {inviting ? 'Generating...' : 'Create Invite Link'}
        </button>
      </form>

      {inviteUrl && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--vk-accent-dim)',
            border: '1px solid rgba(115, 230, 255, 0.3)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--vk-accent)' }}>
              One-Time Invite Link (Valid for 7 Days)
            </span>
            <button
              onClick={() => setInviteUrl(null)}
              style={{ background: 'none', border: 'none', color: 'var(--vk-text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Dismiss
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="input code-font"
              style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--vk-text-secondary)',
  marginBottom: '5px',
};
