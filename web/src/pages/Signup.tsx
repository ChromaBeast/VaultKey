import React, { useCallback, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';
import { PasswordField, Input } from '../components/ui';
import { TurnstileWidget, type TurnstileWidgetHandle } from '../components/auth/TurnstileWidget';
import { useTurnstileConfig } from '../hooks/useTurnstileConfig';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeError, setChallengeError] = useState('');
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
      const res = await apiFetch<{ token: string; user: User; org: Org }>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          org_name: orgName,
          org_slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          email,
          password,
          turnstile_token: turnstileToken,
        }),
      });
      login(res.token, res.user, res.org);
      navigate('/secrets');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Registration failed.');
      if (turnstile.required) challengeRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Set up your team vault."
      error={error || turnstile.error || challengeError}
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--vk-accent)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label
            htmlFor="signup-email"
            style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}
          >
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
          <label
            htmlFor="signup-org"
            style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}
          >
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

        <button
          type="submit"
          disabled={loading || turnstile.loading || Boolean(turnstile.error) || (turnstile.required && !turnstileToken)}
          className="btn btn-primary"
          style={{
            marginTop: '6px',
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {loading ? 'Signing up…' : 'Create your account'}
        </button>

        <p style={{ fontSize: '0.75rem', color: 'var(--vk-text-secondary)', lineHeight: 1.5, margin: '6px 0 0', textAlign: 'center' }}>
          By signing up, you acknowledge our{' '}
          <Link to="/privacy" style={{ color: 'var(--vk-text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
      </form>
    </AuthSplitLayout>
  );
};
