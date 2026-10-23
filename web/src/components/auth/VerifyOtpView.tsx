import React, { useState, useEffect } from 'react';
import { AuthCardLayout } from './AuthCardLayout';
import { OtpSegmentedInput } from './OtpSegmentedInput';
import { Button } from '../ui';

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
      title="Verify code"
      subtitle={`We sent a 6-digit verification code to ${email}`}
      error={error}
      onBack={onBack}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className="flex flex-col items-center w-full"
      >
        <OtpSegmentedInput
          value={otp}
          onChange={setOtp}
          onComplete={() => onSubmit()}
          disabled={loading}
        />

        <div className="my-3 text-center text-xs text-muted-foreground">
          <span>Didn&apos;t receive the code? </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`font-semibold cursor-pointer ${
              cooldown > 0 ? 'text-muted-foreground cursor-default' : 'text-primary hover:text-primary-hover'
            }`}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Click to resend'}
          </button>
        </div>

        <div className="w-full mt-2">
          <Button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full h-11 font-semibold"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </div>
      </form>
    </AuthCardLayout>
  );
};
