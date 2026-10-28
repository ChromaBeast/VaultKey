import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';
import { PasswordField, Input, Button } from '../components/ui';
import { TurnstileWidget, type TurnstileWidgetHandle } from '../components/auth/TurnstileWidget';
import { VerifyOtpView } from '../components/auth/VerifyOtpView';
import { useTurnstileConfig } from '../hooks/useTurnstileConfig';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeError, setChallengeError] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [code, setCode] = useState('');
  const challengeRef = useRef<TurnstileWidgetHandle>(null);
  const turnstile = useTurnstileConfig();

  const { login } = useAuth();
  const navigate = useNavigate();
  const onTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setChallengeError('');
  }, []);
  const onTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setChallengeError('Security verification failed to load. Check your connection and reload this page.');
  }, []);

  // Production signup is two-step: the first POST sends an email code (202),
  // the second POST carries the code and creates the account.
  const submitSignup = async (verificationCode?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<{ status?: string; token: string; user: User; org: Org }>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          org_name: orgName,
          org_slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          email,
          password,
          turnstile_token: turnstileToken,
          verification_code: verificationCode,
        }),
      });
      if (res.status === 'verification_required') {
        setStep('verify');
        return;
      }
      login(res.token, res.user, res.org);
      navigate('/secrets');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Registration failed.');
      if (turnstile.required && step === 'form') challengeRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (turnstile.required && !turnstileToken) {
      setError('Complete the security check to continue.');
      return;
    }
    void submitSignup();
  };

  const resendCode = () => {
    setError('');
    apiFetch('/v1/auth/signup/resend', { method: 'POST', body: JSON.stringify({ email }) }).catch((err) =>
      setError(err instanceof Error ? err.message : 'Could not resend the code.')
    );
  };

  if (step === 'verify') {
    return (
      <VerifyOtpView
        email={email}
        otp={code}
        setOtp={setCode}
        onSubmit={() => void submitSignup(code)}
        onResend={resendCode}
        onBack={() => {
          setStep('form');
          setCode('');
          setTurnstileToken('');
          challengeRef.current?.reset();
        }}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Set up your team vault."
      error={error || turnstile.error || challengeError}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-hover">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="signup-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Work Email
          </label>
          <Input
            id="signup-email"
            type="email"
            required
            placeholder="engineer@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="signup-org" className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Organization / Team Name
          </label>
          <Input
            id="signup-org"
            type="text"
            required
            placeholder="e.g. Acme Cloud"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <PasswordField
          id="signup-password"
          label="Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          autoComplete="new-password"
        />

        {turnstile.required && turnstile.siteKey && (
          <TurnstileWidget
            ref={challengeRef}
            siteKey={turnstile.siteKey}
            onToken={onTurnstileToken}
            onError={onTurnstileError}
          />
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading || turnstile.loading || Boolean(turnstile.error) || (turnstile.required && !turnstileToken)}
          className="w-full mt-1.5 h-11 font-semibold"
        >
          {loading ? 'Signing up…' : 'Create your account'}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-muted-foreground hover:text-foreground underline-offset-4">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground underline-offset-4">
            Privacy Policy
          </Link>.
        </p>
      </form>
    </AuthSplitLayout>
  );
};
