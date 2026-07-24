import React, { useState, useEffect } from 'react';

export const SharePage: React.FC<{ shareId: string }> = ({ shareId }) => {
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/v1/shares/${shareId}`)
      .then((res) => {
        if (!res.ok) throw new Error('This shared secret link has expired, reached its view limit, or self-destructed.');
        return res.json();
      })
      .then((data) => {
        setSecret(data.secret);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [shareId]);

  const handleCopy = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            fontSize: '28px',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
          }}
        >
          🔥
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          One-Time Shared Secret
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px', marginBottom: '28px' }}>
          This secret automatically self-destructs after viewing
        </p>

        {loading && <div style={{ color: '#8b5cf6', fontWeight: 600 }}>Decrypting shared secret...</div>}

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '16px',
              borderRadius: '14px',
              fontSize: '0.875rem',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {secret && (
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
              }}
            >
              {secret}
            </div>
            <button
              onClick={handleCopy}
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
              {copied ? '✓ Copied to Clipboard!' : 'Copy Shared Secret'}
            </button>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '16px' }}>
              ⚠️ Reloading or leaving this page will permanently destroy this link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
