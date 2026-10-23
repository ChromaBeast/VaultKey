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
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3.5 max-w-md">
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
        <div role="alert" className="bg-destructive/10 border border-destructive/30 text-destructive p-2.5 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary self-start mt-1" disabled={submitting}>
        {submitting ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
};
