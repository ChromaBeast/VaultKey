import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthCardLayout } from './AuthCardLayout';
import { KeyboardHint } from './KeyboardHint';

interface SetNewPasswordViewProps {
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  error?: string;
}

export const SetNewPasswordView: React.FC<SetNewPasswordViewProps> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  onBack,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthCardLayout
      title="Set new password"
      subtitle="It must be at least 8 characters."
      error={error}
      onBack={onBack}
    >
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label
            htmlFor="new-password"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--vk-text-secondary)',
              marginBottom: '6px',
            }}
          >
            New Master Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              minLength={8}
              className="input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{ width: '100%', paddingRight: '38px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--vk-text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--vk-text-secondary)',
              marginBottom: '6px',
            }}
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            className="input"
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            style={{ width: '100%' }}
          />
        </div>

        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--vk-text-muted)',
            lineHeight: 1.5,
            margin: '4px 0 0',
          }}
        >
          Make sure to remember your new password. VaultKey uses client-derived encryption keys to keep your secrets private.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={loading || password.length < 8 || password !== confirmPassword}
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
          <KeyboardHint />
        </div>
      </form>
    </AuthCardLayout>
  );
};
