import React, { useState } from 'react';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';

interface SignupProps {
  onSuccess: (token: string, user: User, org: Org) => void;
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ token: string; user: User; org: Org }>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          org_name: orgName,
          org_slug: orgSlug || orgName.toLowerCase().replace(/\s+/g, '-'),
          email,
          password,
        }),
      });
      onSuccess(res.token, res.user, res.org);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '460px', margin: '50px auto', padding: '32px' }}>
      <div className="glass" style={{ padding: '36px', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            ✨
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Create Team Vault</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>
            Set up isolated zero-trust secrets management for your team
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
              Organization / Team Name
            </label>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g. Acme Corp"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                if (!orgSlug) setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
              Team Identifier (Slug)
            </label>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g. acme-corp"
              value={orgSlug}
              onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
              Admin Email
            </label>
            <input
              type="email"
              required
              className="input"
              placeholder="admin@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
              Master Password (Derived in RAM)
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="input"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: '10px', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: '#fff' }}
          >
            {loading ? 'Initializing Vault...' : 'Initialize Vault & Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Already registered?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
