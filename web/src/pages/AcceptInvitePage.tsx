import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { acceptInvite, fetchInviteDetails, errorMessage } from '../lib/api';
import type { InviteDetails } from '../lib/api';
import { pushToast } from '../lib/toast';
import { PasswordField } from '../components/ui/PasswordField';
import { setSessionToken } from '../lib/session';

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

    setSubmitting(true);
    try {
      const res = await acceptInvite(token, password);
      if (res.token) {
        setSessionToken(res.token);
        if (res.user) localStorage.setItem('vk_user', JSON.stringify(res.user));
        if (res.org) localStorage.setItem('vk_org', JSON.stringify(res.org));
      }
      pushToast(`Welcome to ${invite?.org_name || 'the team'}!`, 'success');
      navigate('/secrets');
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to accept invitation'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background text-foreground">
      <div className="glass w-full max-w-md p-8 sm:p-9 rounded-xl border border-border">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-3.5 border border-primary/25">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
            Accept Invitation
          </h1>
          <p className="text-xs text-muted-foreground">
            Create your password to join the workspace.
          </p>
        </div>

        {loading && (
          <div className="text-center py-8 text-muted-foreground text-sm font-medium animate-pulse">
            Verifying invitation token…
          </div>
        )}

        {!loading && error && (
          <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive flex gap-2.5 items-start mb-4">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>Invitation Error</strong>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && invite && (
          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
            <div className="p-3.5 rounded-lg bg-secondary/60 border border-border">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Organization</div>
              <div className="text-foreground font-semibold text-sm mt-0.5">{invite.org_name}</div>
              <div className="flex justify-between items-center mt-2.5 text-xs text-muted-foreground">
                <span>Account: {invite.email}</span>
                <span className={`badge badge-${invite.role === 'write' ? 'write' : invite.role === 'admin' ? 'admin' : 'read'}`}>{invite.role}</span>
              </div>
            </div>

            <PasswordField
              id="accept-password"
              label="Choose Password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />

            <button
              type="submit"
              className="btn btn-primary w-full h-11 justify-center gap-2 mt-2 font-semibold"
              disabled={submitting}
            >
              {submitting ? 'Joining…' : 'Join Organization'}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </form>
        )}

        <div className="text-center mt-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
