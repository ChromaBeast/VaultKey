import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { acceptInvite, fetchInviteDetails, errorMessage } from '../lib/api';
import type { InviteDetails } from '../lib/api';
import { pushToast } from '../lib/toast';

export const AcceptInvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const hasToken = Boolean(token);
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(hasToken);
  const [error, setError] = useState<string | null>(
    hasToken ? null : 'Missing invite token. Please verify your invitation link.'
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    const ctrl = new AbortController();
    fetchInviteDetails(token, ctrl.signal)
      .then((data) => {
        setInvite(data);
        setError(null);
      })
      .catch((err) => {
        if (!ctrl.signal.aborted) {
          setError(errorMessage(err, 'This invitation is invalid or has expired.'));
        }
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (password.length < 8) {
      pushToast('Password must be at least 8 characters long', 'error');
      return;
    }
    if (password !== confirmPassword) {
      pushToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await acceptInvite(token, password);
      if (res.token) {
        localStorage.setItem('vk_token', res.token);
        if (res.user) localStorage.setItem('vk_user', JSON.stringify(res.user));
        if (res.org) localStorage.setItem('vk_org', JSON.stringify(res.org));
      }
      pushToast(`Welcome to ${invite?.org_name || 'the team'}! Your vault key is activated.`, 'success');
      window.location.href = '/secrets';
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to accept invitation'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--vk-bg)' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-accent-dim)', color: 'var(--vk-accent)', marginBottom: '14px', border: '1px solid rgba(60, 237, 235, 0.3)' }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--vk-text)', marginBottom: '4px' }}>
            Accept Invitation
          </h1>
          <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem' }}>
            Set your password to derive your zero-knowledge vault key.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--vk-text-muted)', fontSize: '0.85rem' }}>
            Verifying invitation token...
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-danger-dim)', border: '1px solid rgba(255, 107, 122, 0.3)', color: 'var(--vk-danger)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.825rem' }}>
              <strong>Invitation Error</strong>
              <p style={{ margin: '4px 0 0' }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && invite && (
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-surface-2)', border: '1px solid var(--vk-border)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--vk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization</div>
              <div style={{ color: 'var(--vk-text)', fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>{invite.org_name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem', color: 'var(--vk-text-secondary)' }}>
                <span>Account: {invite.email}</span>
                <span className={`badge badge-${invite.role === 'write' ? 'write' : invite.role === 'admin' ? 'admin' : 'read'}`}>{invite.role}</span>
              </div>
            </div>

            <div>
              <label htmlFor="accept-password" style={labelStyle}>Choose Password</label>
              <input
                id="accept-password"
                type="password"
                required
                minLength={8}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label htmlFor="accept-confirm" style={labelStyle}>Confirm Password</label>
              <input
                id="accept-confirm"
                type="password"
                required
                minLength={8}
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', padding: '11px', marginTop: '6px', justifyContent: 'center' }}>
              <KeyRound size={14} />
              {submitting ? 'Activating Key...' : 'Activate & Enter Vault'}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: 'var(--vk-text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--vk-text-secondary)',
  marginBottom: '5px',
};
