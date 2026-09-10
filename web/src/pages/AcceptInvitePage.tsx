import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
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
      pushToast(`Welcome to ${invite?.org_name || 'the team'}! Your vault key is now activated.`, 'success');
      window.location.href = '/secrets';
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to accept invitation'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '36px', borderRadius: '18px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', background: 'rgba(94, 231, 255, 0.1)', color: '#5ee7ff', marginBottom: '14px' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            Accept Invitation
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Set your password to derive your zero-knowledge vault key.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Loader2 className="spin" size={18} /> Verifying invitation link...
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.875rem' }}>
              <strong>Invitation Error</strong>
              <p style={{ margin: '4px 0 0', color: '#f87171' }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && invite && (
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization</div>
              <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>{invite.org_name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
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

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', padding: '12px', marginTop: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {submitting ? <Loader2 className="spin" size={16} /> : <KeyRound size={16} />}
              {submitting ? 'Deriving & Activating...' : 'Activate Account & Enter Vault'}
              {!submitting && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.825rem' }}
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
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#cbd5e1',
  marginBottom: '6px',
};
