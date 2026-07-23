import React, { useState } from 'react';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';

interface LoginProps {
  onSuccess: (token: string, user: User, org: Org) => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ token: string; user: User; org: Org }>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      onSuccess(res.token, res.user, res.org);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '420px', margin: '60px auto', padding: '32px' }}>
      <div className="glass" style={{ padding: '36px', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🗝️
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>
            Enter your credentials to derive your team vault key
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Work Email
            </label>
            <input
              type="email"
              required
              className="input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Master Password
            </label>
            <input
              type="password"
              required
              className="input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: '8px', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff' }}
          >
            {loading ? 'Unlocking Vault...' : 'Unlock Vault & Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Don't have a team vault yet?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Create Team Account
          </button>
        </div>
      </div>
    </div>
  );
};
