import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { KeyRound, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';

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
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--vk-bg)' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              margin: '0 auto 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, rgba(115, 230, 255, 0.2) 0%, rgba(139, 124, 255, 0.2) 100%)',
              border: '1px solid rgba(115, 230, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyRound size={20} color="var(--vk-accent)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.02em' }}>
            Sign in to your vault
          </h1>
          <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem', marginTop: '4px' }}>
            Enter your credentials to derive your team master key
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--vk-danger-dim)',
              border: '1px solid rgba(255, 107, 122, 0.3)',
              color: 'var(--vk-danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}>
              Work Email
            </label>
            <input
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)' }}>
                Master Password
              </label>
            </div>
            <input
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
              justifyContent: 'center',
              padding: '11px',
              fontSize: '0.875rem',
            }}
          >
            {loading ? 'Deriving Key...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--vk-border)' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--vk-text-muted)' }}>
            New to VaultKey?{' '}
          </span>
          <Link
            to="/signup"
            style={{
              color: 'var(--vk-accent)',
              fontWeight: 600,
              fontSize: '0.825rem',
            }}
          >
            Create your vault
          </Link>
        </div>
      </div>
    </div>
  );
};
