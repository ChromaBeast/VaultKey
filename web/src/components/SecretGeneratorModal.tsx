import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';

interface GeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onUseSecret: (secret: string) => void;
}

const generateSecret = (length: number, numbers: boolean, symbols: boolean): string => {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[array[i] % chars.length];
  }
  return res;
};

export const SecretGeneratorModal: React.FC<GeneratorProps> = ({ isOpen, onClose, onUseSecret }) => {
  const [length, setLength] = useState(32);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [secret, setSecret] = useState(() => generateSecret(32, true, true));
  const { copied, copy } = useClipboard();

  const generate = () => {
    setSecret(generateSecret(length, useNumbers, useSymbols));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={440}>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>High-Entropy Generator</h3>
          <button onClick={onClose} aria-label="Close generator" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            x
          </button>
        </div>

        <div
          className="code-font"
          style={{
            background: '#090d16',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            wordBreak: 'break-all',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
            fontSize: '0.95rem',
            marginBottom: '20px',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          {secret || <span style={{ color: '#94a3b8' }}>Click Generate below</span>}        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Password Length</span>
              <strong style={{ color: '#c084fc' }}>{length} characters</strong>
            </div>
            <input type="range" min="12" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: '100%', accentColor: '#8b5cf6' }} />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} style={{ accentColor: '#8b5cf6' }} /> Numbers (0-9)
            </label>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} style={{ accentColor: '#8b5cf6' }} /> Symbols (!@#$)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={generate} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <Dices size={15} /> Generate
          </button>
          {secret && (
            <>
              <button onClick={() => copy(secret)} className="btn btn-secondary" style={copied ? { color: '#34d399' } : undefined}>
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => {
                  onUseSecret(secret);
                  onClose();
                }}
                className="btn btn-primary"
              >
                Use Secret
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
