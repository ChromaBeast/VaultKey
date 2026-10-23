import React, { useEffect, useRef, useState } from 'react';
import { Lock, AlertTriangle, Copy, Check } from 'lucide-react';
import { ApiError, errorMessage, fetchSharedSecret, isAbortError } from '../lib/api';
import { useClipboard } from '../hooks/useClipboard';

type Phase = 'gate' | 'loading' | 'ready' | 'locked' | 'error';

const EXPIRED_COPY = 'This link has expired or has already been viewed.';

export const SharePage: React.FC<{ shareId: string }> = ({ shareId }) => {
  const [phase, setPhase] = useState<Phase>('gate');
  const [secret, setSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const controllerRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);
  const { copied, copy } = useClipboard();

  useEffect(() => () => { controllerRef.current?.abort(); }, []);

  const reveal = async () => {
    if (startedRef.current && controllerRef.current) return;
    if (controllerRef.current) return;
    startedRef.current = true;

    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    setPhase('loading');
    setErrorMsg('');

    try {
      const data = await fetchSharedSecret(shareId, ctrl.signal);
      setSecret(data.secret);
      setPhase('ready');
    } catch (err) {
      if (isAbortError(err)) {
        setPhase('gate');
        startedRef.current = false;
        return;
      }
      if (err instanceof ApiError && err.status === 423) {
        setPhase('locked');
      } else {
        setErrorMsg(errorMessage(err, EXPIRED_COPY));
        setPhase('error');
      }
    } finally {
      if (controllerRef.current === ctrl) controllerRef.current = null;
    }
  };

  return (
    <div className="animate-fade min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background text-foreground">
      <div className="glass w-full max-w-md p-8 sm:p-9 text-center rounded-xl border border-border">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/vaultkey-logo.png" alt="" className="h-6 w-6 object-contain" />
          <span className="font-extrabold text-foreground text-sm tracking-tight">VaultKey</span>
        </div>

        <div className="w-11 h-11 mx-auto mb-4 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
          <Lock size={18} />
        </div>

        {phase === 'gate' && (
          <div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              One-Time Secret
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              This encrypted secret link can only be viewed once. Once revealed, the record is permanently consumed.
            </p>
            <button
              onClick={() => void reveal()}
              className="btn btn-primary w-full justify-center h-11 font-semibold"
            >
              Reveal Secret
            </button>
          </div>
        )}

        {phase === 'loading' && (
          <div className="text-primary text-sm py-6 font-medium animate-pulse">
            Decrypting secret from server memory…
          </div>
        )}

        {phase === 'locked' && (
          <div>
            <div className="bg-amber-500/10 border border-amber-500/25 text-amber-400 p-3.5 rounded-lg text-xs mb-4 flex gap-2.5 text-left">
              <Lock size={15} className="shrink-0 mt-0.5" />
              <span>The vault is locked. Contact the organization administrator to unlock it.</span>
            </div>
            <button
              onClick={() => { startedRef.current = false; void reveal(); }}
              className="btn btn-secondary w-full justify-center h-10"
            >
              Retry
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <div className="bg-destructive/10 border border-destructive/25 text-destructive p-3.5 rounded-lg text-xs mb-4 flex gap-2.5 text-left">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg || EXPIRED_COPY}</span>
            </div>
            <button
              onClick={() => { startedRef.current = false; void reveal(); }}
              className="btn btn-secondary w-full justify-center h-10"
            >
              Try Again
            </button>
          </div>
        )}

        {phase === 'ready' && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-left font-medium">Decrypted payload:</p>
            <div className="font-mono bg-background p-3.5 rounded-lg border border-emerald-500/30 break-all text-emerald-400 text-sm mb-4 text-left select-all">
              {secret}
            </div>
            <button
              onClick={() => void copy(secret)}
              className="btn btn-primary w-full justify-center h-11 gap-2 font-semibold"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied to Clipboard' : 'Copy Secret'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
