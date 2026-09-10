import React, { useEffect, useRef, useState } from 'react';
import { Flame, Lock, AlertTriangle, Copy, Check } from 'lucide-react';
import { ApiError, errorMessage, fetchSharedSecret, isAbortError } from '../lib/api';
import { useClipboard } from '../hooks/useClipboard';

type Phase = 'gate' | 'loading' | 'ready' | 'locked' | 'error';

const EXPIRED_COPY = 'This shared secret link has expired, reached its view limit, or self-destructed.';

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
      <div className="glass" style={{ width: '100%', maxWidth: '460px', padding: '36px 30px', textAlign: 'center' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            margin: '0 auto 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--vk-danger-dim)',
            border: '1px solid rgba(255, 107, 122, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flame size={22} color="var(--vk-danger)" />
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.02em' }}>
          One-Time Shared Secret
        </h1>
        <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem', marginTop: '4px', marginBottom: '24px' }}>
          This secret permanently self-destructs after it is revealed once
        </p>

        {phase === 'gate' && (
          <div>
            <p style={{ color: 'var(--vk-text-secondary)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.55 }}>
              The payload remains encrypted on the server until revealed. Once opened, the link is burned and can never be viewed again.
            </p>
            <button onClick={() => void reveal()} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.875rem' }}>
              Reveal Secret
            </button>
          </div>
        )}

        {phase === 'loading' && <div style={{ color: 'var(--vk-accent)', fontSize: '0.875rem', padding: '16px 0' }}>Decrypting payload...</div>}

        {phase === 'locked' && (
          <div>
            <div style={{ background: 'var(--vk-warning-dim)', border: '1px solid rgba(244, 199, 106, 0.3)', color: 'var(--vk-warning)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '16px', display: 'flex', gap: '8px', textAlign: 'left' }}>
              <Lock size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>The vault is currently locked. Ask the vault owner to unlock it and retry.</span>
            </div>
            <button onClick={() => { startedRef.current = false; void reveal(); }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Retry
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <div style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(255, 107, 122, 0.3)', color: 'var(--vk-danger)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '16px', display: 'flex', gap: '8px', textAlign: 'left' }}>
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
                background: '#07090e',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(67, 211, 158, 0.3)',
                wordBreak: 'break-all',
                color: 'var(--vk-success)',
                fontSize: '0.9rem',
                marginBottom: '18px',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
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
            <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.75rem', marginTop: '14px' }}>
              Leaving or refreshing this page permanently burns this secret link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
