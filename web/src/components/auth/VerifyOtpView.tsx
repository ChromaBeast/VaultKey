import React, { useState, useEffect } from 'react';
import { AuthCardLayout } from './AuthCardLayout';
import { OtpSegmentedInput } from './OtpSegmentedInput';
import { KeyboardHint } from './KeyboardHint';

interface VerifyOtpViewProps {
  email: string;
  otp: string;
  setOtp: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
  loading: boolean;
  error?: string;
}

export const VerifyOtpView: React.FC<VerifyOtpViewProps> = ({
  email,
  otp,
  setOtp,
  onSubmit,
  onResend,
  onBack,
  loading,
  error,
}) => {
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    onResend();
    setCooldown(60);
  };

  return (
    <AuthCardLayout
      title="Password reset"
      subtitle={`We sent a 6-digit verification code to ${email}`}
      error={error}
      onBack={onBack}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
      >
        <OtpSegmentedInput
          value={otp}
          onChange={setOtp}
          onComplete={() => onSubmit()}
          disabled={loading}
        />

        <div style={{ margin: '8px 0 24px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--vk-text-muted)' }}>
            Didn&apos;t receive the email?{' '}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            style={{
              background: 'none',
              border: 'none',
              color: cooldown > 0 ? 'var(--vk-text-muted)' : 'var(--vk-accent)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: cooldown > 0 ? 'default' : 'pointer',
              padding: 0,
              textDecoration: 'none',
            }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Click to resend'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', width: '100%' }}>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="btn btn-primary"
            style={{
              minWidth: '130px',
              justifyContent: 'center',
              padding: '10px 18px',
              fontSize: '0.875rem',
            }}
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
          <KeyboardHint />
        </div>
      </form>
    </AuthCardLayout>
  );
};
