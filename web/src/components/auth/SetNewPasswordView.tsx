import React from 'react';
import { AuthCardLayout } from './AuthCardLayout';
import { PasswordField } from '../ui/PasswordField';
import { Button } from '../ui';

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
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <PasswordField
          id="new-password"
          label="New Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          autoFocus
          autoComplete="new-password"
        />

        <div className="mt-1.5">
          <Button
            type="submit"
            disabled={loading || password.length < 8}
            className="w-full h-11 font-semibold"
          >
            {loading ? 'Updating...' : 'Reset password'}
          </Button>
        </div>
      </form>
    </AuthCardLayout>
  );
};
