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
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--vk-bg)' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '36px 28px', textAlign: 'center' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            margin: '0 auto 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--vk-accent-dim)',
            border: '1px solid rgba(91, 141, 239, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={20} color="var(--vk-accent)" />
        </div>

        {phase === 'gate' && (
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--vk-text)', marginBottom: '12px' }}>
              One-Time Secret
            </h1>
            <p style={{ color: 'var(--vk-text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              This link can only be viewed once.
            </p>
            <button onClick={() => void reveal()} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem' }}>
              Reveal Secret
            </button>
          </div>
        )}

        {phase === 'loading' && <div style={{ color: 'var(--vk-accent)', fontSize: '0.875rem', padding: '20px 0' }}>Decrypting secret…</div>}

        {phase === 'locked' && (
          <div>
            <div style={{ background: 'var(--vk-warning-dim)', border: '1px solid rgba(245, 166, 35, 0.3)', color: 'var(--vk-warning)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '16px', display: 'flex', gap: '8px', textAlign: 'left' }}>
              <Lock size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>The vault is locked. Ask the owner to unlock it.</span>
            </div>
            <button onClick={() => { startedRef.current = false; void reveal(); }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Retry
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <div style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--vk-danger)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '16px', display: 'flex', gap: '8px', textAlign: 'left' }}>
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMsg || EXPIRED_COPY}</span>
            </div>
            <button onClick={() => { startedRef.current = false; void reveal(); }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Try Again
            </button>
          </div>
        )}

        {phase === 'ready' && (
          <div>
            <div
              className="code-font"
              style={{
                background: 'var(--vk-bg)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                wordBreak: 'break-all',
                color: 'var(--vk-success)',
                fontSize: '0.9rem',
                marginBottom: '18px',
                textAlign: 'left',
              }}
            >
              {secret}
            </div>
            <button
              onClick={() => void copy(secret)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.875rem' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied to Clipboard' : 'Copy Secret'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
