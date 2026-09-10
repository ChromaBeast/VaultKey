import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ token: string; user: User; org: Org }>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(res.token, res.user, res.org);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from && from.startsWith('/') ? from : '/secrets', { replace: true });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Authentication failed. Verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Sign in to your vault"
      subtitle="Enter your credentials to derive your team master key in memory"
      error={error}
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: 'var(--vk-accent)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create your vault
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label
            htmlFor="login-email"
            style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '6px' }}
          >
            Work Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            className="input"
            placeholder="engineer@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label
              htmlFor="login-password"
              style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)' }}
            >
              Master Password
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.78rem',
                color: 'var(--vk-accent)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            required
            className="input"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{
            marginTop: '8px',
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {loading ? 'Deriving Key...' : 'Log in'}
        </button>
      </form>
    </AuthSplitLayout>
  );
};
