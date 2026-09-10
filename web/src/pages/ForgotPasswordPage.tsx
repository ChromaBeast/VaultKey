import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { RequestResetView } from '../components/auth/RequestResetView';
import { VerifyOtpView } from '../components/auth/VerifyOtpView';
import { SetNewPasswordView } from '../components/auth/SetNewPasswordView';
import { ResetSuccessView } from '../components/auth/ResetSuccessView';

type Step = 'request' | 'otp' | 'new_password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch<{ status: string }>('/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to request reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ status: string; reset_token: string }>('/v1/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, code: otp }),
      });
      setResetToken(res.reset_token);
      setStep('new_password');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      await apiFetch<{ status: string }>('/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to resend code.');
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await apiFetch<{ status: string }>('/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ reset_token: resetToken, password }),
      });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <RequestResetView
        email={email}
        setEmail={setEmail}
        onSubmit={handleRequestReset}
        loading={loading}
        error={error}
        onBack={() => navigate('/login')}
      />
    );
  }

  if (step === 'otp') {
    return (
      <VerifyOtpView
        email={email}
        otp={otp}
        setOtp={setOtp}
        onSubmit={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={() => {
          setError('');
          setStep('request');
        }}
        loading={loading}
        error={error}
      />
    );
  }

  if (step === 'new_password') {
    return (
      <SetNewPasswordView
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={handleSetNewPassword}
        onBack={() => {
          setError('');
          setStep('otp');
        }}
        loading={loading}
        error={error}
      />
    );
  }

  return <ResetSuccessView />;
};
