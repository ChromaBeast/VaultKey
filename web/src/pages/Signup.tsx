import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Org, User } from '../lib/api';
import { apiFetch } from '../lib/api';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';
import { PasswordField } from '../components/ui/PasswordField';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      subtitle="Set up your team vault."
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

        <PasswordField
          id="signup-password"
          label="Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          autoComplete="new-password"
        />

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
          {loading ? 'Signing up…' : 'Create your account'}
        </button>

        <p style={{ fontSize: '0.74rem', color: 'var(--vk-text-muted)', lineHeight: 1.4, margin: '6px 0 0', textAlign: 'center' }}>
          By signing up, you agree to our{' '}
          <Link to="/privacy" style={{ color: 'var(--vk-text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
      </form>
    </AuthSplitLayout>
  );
};
