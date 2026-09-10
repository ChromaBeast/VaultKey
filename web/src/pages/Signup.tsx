import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ token: string; user: User; org: Org }>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          org_name: orgName,
          org_slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          email,
          password,
        }),
      });
      login(res.token, res.user, res.org);
      navigate('/secrets');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Provision an isolated zero-trust encrypted vault for your engineering team"
      error={error}
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
          <input
            id="signup-email"
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
          <label
            htmlFor="signup-org"
            style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}
          >
            Organization / Team Name
          </label>
          <input
            id="signup-org"
            type="text"
            required
            className="input"
            placeholder="e.g. Acme Cloud"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}
          >
            Master Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            className="input"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--vk-text-secondary)', marginBottom: '5px' }}
          >
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            type="password"
            required
            minLength={8}
            className="input"
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
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
          {loading ? 'Initializing Vault...' : 'Create your account'}
        </button>

        <p style={{ fontSize: '0.74rem', color: 'var(--vk-text-muted)', lineHeight: 1.4, margin: '6px 0 0', textAlign: 'center' }}>
          By clicking &ldquo;Create your account&rdquo;, you agree to our{' '}
          <Link to="/privacy" style={{ color: 'var(--vk-text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
          {' '}and security terms.
        </p>
      </form>
    </AuthSplitLayout>
  );
};
