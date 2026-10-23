import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';
import { PasswordField, Input, Button } from '../components/ui';
import { TurnstileWidget, type TurnstileWidgetHandle } from '../components/auth/TurnstileWidget';
import { useTurnstileConfig } from '../hooks/useTurnstileConfig';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeError, setChallengeError] = useState('');
  const challengeRef = useRef<TurnstileWidgetHandle>(null);
  const turnstile = useTurnstileConfig();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
    setChallengeError('');
  }, []);
  const onTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setChallengeError('Security verification failed to load. Check your connection and reload this page.');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (turnstile.required && !turnstileToken) {
      setError('Complete the security check to continue.');
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch<{ token: string; user: User; org: Org }>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, turnstile_token: turnstileToken }),
      });
      login(res.token, res.user, res.org);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from && from.startsWith('/') ? from : '/secrets', { replace: true });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Authentication failed. Verify your credentials.');
      if (turnstile.required) challengeRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Sign in to your vault"
      subtitle="Welcome back."
      error={error || turnstile.error || challengeError}
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-hover">
            Create your vault
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Work Email
          </label>
          <Input
            id="login-email"
            type="email"
            required
            placeholder="engineer@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {turnstile.required && turnstile.siteKey && (
          <TurnstileWidget
            ref={challengeRef}
            siteKey={turnstile.siteKey}
            onToken={onTurnstileToken}
            onError={onTurnstileError}
          />
        )}

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-muted-foreground">
              Master Password
            </label>
            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-hover font-medium">
              Forgot password?
            </Link>
          </div>
          <PasswordField
            id="login-password"
            label=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading || turnstile.loading || Boolean(turnstile.error) || (turnstile.required && !turnstileToken)}
          className="w-full mt-2 h-11 font-semibold"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </Button>
      </form>
    </AuthSplitLayout>
  );
};
