import React, { useEffect, useRef, useState } from 'react';
import { Flame, Lock, TriangleAlert } from 'lucide-react';
import { ApiError, errorMessage, fetchSharedSecret, isAbortError } from '../lib/api';
import { useClipboard } from '../hooks/useClipboard';

type Phase = 'gate' | 'loading' | 'ready' | 'locked' | 'error';

const EXPIRED_COPY =
  'This shared secret link has expired, reached its view limit, or self-destructed.';

export const SharePage: React.FC<{ shareId: string }> = ({ shareId }) => {
  const [phase, setPhase] = useState<Phase>('gate');
  const [secret, setSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const controllerRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);
  const { copied, copy } = useClipboard();

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    []
  );

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
    <div className="animate-fade" style={{ maxWidth: '480px', margin: '80px auto', padding: '16px' }}>
      <div className="glass-glow" style={{ padding: '40px 32px', borderRadius: '24px', textAlign: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ef4444 0%, #d946ef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
          }}
        >
          <Flame size={28} color="#fff" />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          One-Time Shared Secret
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px', marginBottom: '28px' }}>
          This secret self-destructs after it is revealed once
        </p>

        {phase === 'gate' && (
          <div>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.6 }}>
              The value stays encrypted on the server until you reveal it. Once displayed,
              the link is permanently burned and cannot be opened again by anyone.
            </p>
            <button onClick={() => void reveal()} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', borderRadius: '12px' }}>
              Reveal Secret
            </button>
          </div>
        )}

        {phase === 'loading' && <div style={{ color: '#8b5cf6', fontWeight: 600 }}>Revealing shared secret...</div>}

        {phase === 'locked' && (
          <div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', padding: '16px', borderRadius: '14px', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '18px', display: 'flex', gap: '10px', textAlign: 'left' }}>
              <Lock size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>The vault is locked right now. Ask the owner to unlock it and retry.</span>
            </div>
            <button onClick={() => { startedRef.current = false; void reveal(); }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '12px' }}>
              Retry
            </button>
          </div>
        )}

        {phase === 'error' && (
          <div>
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '16px', borderRadius: '14px', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '18px', display: 'flex', gap: '10px', textAlign: 'left' }}>
              <TriangleAlert size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMsg || EXPIRED_COPY}</span>
            </div>
            <button onClick={() => { startedRef.current = false; void reveal(); }} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '12px' }}>
              Try Again
            </button>
          </div>
        )}

        {phase === 'ready' && (
          <div>
            <div
              className="code-font"
              style={{
                background: '#090d16',
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                wordBreak: 'break-all',
                color: '#34d399',
                fontSize: '1rem',
                marginBottom: '24px',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                textAlign: 'left',
              }}
            >
              {secret}
            </div>
            <button
              onClick={() => void copy(secret)}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: copied ? '#10b981' : undefined,
                padding: '14px',
                fontSize: '0.95rem',
                borderRadius: '12px',
              }}
            >
              {copied ? 'Copied to Clipboard' : 'Copy Shared Secret'}
            </button>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '16px' }}>
              Reloading or leaving this page permanently destroys this link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
