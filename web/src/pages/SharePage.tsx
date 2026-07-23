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
    <div className="animate-fade" style={{ maxWidth: '460px', margin: '80px auto', padding: '24px' }}>
      <div className="glass" style={{ padding: '36px', borderRadius: '20px', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
          🔥
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>One-Time Shared Secret</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '24px' }}>
          This secret automatically self-destructs after viewing
        </p>

        {loading && <div style={{ color: '#6366f1' }}>Decrypting shared secret...</div>}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '14px', borderRadius: '10px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {secret && (
          <div>
            <div className="code-font" style={{ background: '#0e0e0e', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', wordBreak: 'break-all', color: '#10b981', fontSize: '1rem', marginBottom: '20px' }}>
              {secret}
            </div>
            <button onClick={handleCopy} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: copied ? '#10b981' : '#6366f1', color: '#fff', padding: '12px' }}>
              {copied ? '✓ Copied to Clipboard!' : 'Copy Shared Secret'}
            </button>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '12px' }}>
              ⚠️ Reloading or closing this page will permanently destroy this link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
