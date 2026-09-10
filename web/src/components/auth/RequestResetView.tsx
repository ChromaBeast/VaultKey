import React from 'react';
import { AuthCardLayout } from './AuthCardLayout';
import { KeyboardHint } from './KeyboardHint';

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
      subtitle="Enter the email address associated with your vault and we'll send you a 6-digit code to reset your password."
      error={error}
      onBack={onBack}
    >
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label
            htmlFor="reset-email"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--vk-text-secondary)',
              marginBottom: '6px',
            }}
          >
            Work Email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            autoFocus
            className="input"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--vk-text-muted)',
            lineHeight: 1.5,
            margin: '0',
          }}
        >
          If your email address exists in our database, you will receive a 6-digit verification code to securely reset your master password.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={loading || !email}
            className="btn btn-primary"
            style={{
              minWidth: '130px',
              justifyContent: 'center',
              padding: '10px 18px',
              fontSize: '0.875rem',
            }}
          >
            {loading ? 'Sending...' : 'Send code'}
          </button>
          <KeyboardHint />
        </div>
      </form>
    </AuthCardLayout>
  );
};
