import React from 'react';
import { AuthCardLayout } from './AuthCardLayout';
import { PasswordField } from '../ui/PasswordField';

interface SetNewPasswordViewProps {
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  error?: string;
}

export const SetNewPasswordView: React.FC<SetNewPasswordViewProps> = ({
  password,
  setPassword,
  onSubmit,
  onBack,
  loading,
  error,
}) => {
  return (
    <AuthCardLayout
      title="Set new password"
      subtitle="Must be at least 8 characters."
      error={error}
      onBack={onBack}
    >
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PasswordField
          id="new-password"
          label="New Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          autoFocus
          autoComplete="new-password"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
          <button
            type="submit"
            disabled={loading || password.length < 8}
            className="btn btn-primary"
            style={{
              minWidth: '150px',
              justifyContent: 'center',
              padding: '10px 18px',
              fontSize: '0.875rem',
            }}
          >
            {loading ? 'Updating...' : 'Reset password'}
          </button>
        </div>
      </form>
    </AuthCardLayout>
  );
};
