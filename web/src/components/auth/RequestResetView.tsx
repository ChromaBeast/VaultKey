import React from 'react';
import { AuthCardLayout } from './AuthCardLayout';
import { Input, Button } from '../ui';

interface RequestResetViewProps {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string;
  onBack: () => void;
}

export const RequestResetView: React.FC<RequestResetViewProps> = ({
  email,
  setEmail,
  onSubmit,
  loading,
  error,
  onBack,
}) => {
  return (
    <AuthCardLayout
      title="Forgot your password?"
      subtitle="Enter the email address associated with your vault and we will send you a 6-digit code to reset your password."
      error={error}
      onBack={onBack}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="reset-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Work Email
          </label>
          <Input
            id="reset-email"
            type="email"
            required
            autoFocus
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="flex items-center gap-3 mt-1.5">
          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full h-11 font-semibold"
          >
            {loading ? 'Sending...' : 'Send reset code'}
          </Button>
        </div>
      </form>
    </AuthCardLayout>
  );
};
