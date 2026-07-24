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
    <div className="animate-fade" style={{ maxWidth: '440px', margin: '40px auto', padding: '16px' }}>
      <div className="glass-glow" style={{ padding: '40px 36px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
            }}
          >
            🗝️
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f8fafc' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '6px' }}>
            Derive your team encryption key & unlock vault
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1' }}>
                Master Password
              </label>
              <span className="code-font" style={{ fontSize: '0.7rem', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                Zero-Knowledge
              </span>
            </div>
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
            style={{
              marginTop: '10px',
              justifyContent: 'center',
              padding: '14px',
              fontSize: '0.95rem',
              borderRadius: '12px',
            }}
          >
            {loading ? 'Unlocking Vault...' : 'Unlock Vault & Sign In →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Need a new team vault?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: '#c084fc',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Create Team Account
          </button>
        </div>
      </div>
    </div>
  );
};
