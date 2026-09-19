import React, { useState } from 'react';
import { changePassword, errorMessage } from '../../lib/api';
import { pushToast } from '../../lib/toast';
import { PasswordField } from '../ui/PasswordField';

export const PasswordChangeForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      pushToast('Password updated', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(errorMessage(err, 'Failed to update password'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
      <PasswordField
        id="current-password"
        label="Current Password"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <PasswordField
        id="new-password"
        label="New Password (min. 8 characters)"
        minLength={8}
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {error && (
        <div role="alert" style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--vk-danger)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
        {submitting ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
};
