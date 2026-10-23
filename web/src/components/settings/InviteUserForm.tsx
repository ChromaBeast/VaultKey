import React, { useState } from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';
import { inviteUser, errorMessage } from '../../lib/api';
import { pushToast } from '../../lib/toast';
import { Input, Select } from '../ui';

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
    <div className="flex flex-col gap-4 mb-5">
      <form onSubmit={(e) => void handleInvite(e)} className="flex gap-2.5 flex-wrap items-end">
        <div className="flex-1 min-w-[240px]">
          <label htmlFor="invite-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address</label>
          <Input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
          />
        </div>
        <div className="w-32">
          <label htmlFor="invite-role" className="block text-xs font-semibold text-muted-foreground mb-1.5">Role</label>
          <Select id="invite-role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="read">Read Only</option>
            <option value="write">Read & Write</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={inviting}>
          <UserPlus size={14} /> {inviting ? 'Generating...' : 'Create Invite Link'}
        </button>
      </form>

      {inviteUrl && (
        <div className="p-3.5 bg-primary/10 border border-primary/25 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-primary">
              One-Time Invite Link (Valid for 7 Days)
            </span>
            <button
              onClick={() => setInviteUrl(null)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              readOnly
              mono
              value={inviteUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="btn btn-primary text-xs px-3.5 py-2 whitespace-nowrap"
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
