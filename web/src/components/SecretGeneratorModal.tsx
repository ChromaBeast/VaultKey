import React, { useState } from 'react';

interface GeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onUseSecret: (secret: string) => void;
}

export const SecretGeneratorModal: React.FC<GeneratorProps> = ({ isOpen, onClose, onUseSecret }) => {
  const [length, setLength] = useState(32);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [secret, setSecret] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generate = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setSecret(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
      <div className="glass animate-fade" style={{ width: '420px', padding: '28px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>🎲 High-Entropy Generator</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>

        <div className="code-font" style={{ background: '#0e0e0e', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', wordBreak: 'break-all', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '0.95rem', marginBottom: '16px' }}>
          {secret || <span style={{ color: '#64748b' }}>Click Generate below</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
              Length: <strong>{length} chars</strong>
            </label>
            <input type="range" min="12" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: '100%', marginTop: '6px' }} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} /> Numbers (0-9)
            </label>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} /> Symbols (!@#$)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={generate} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            🔄 Generate
          </button>
          {secret && (
            <>
              <button onClick={handleCopy} className="btn btn-secondary" style={{ background: copied ? 'rgba(16, 185, 129, 0.2)' : 'transparent', color: copied ? '#10b981' : '#fff' }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={() => { onUseSecret(secret); onClose(); }} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: '#fff' }}>
                Use Secret
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
