import React, { useState } from 'react';
import { Dices, Check, Copy } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';

interface GeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onUseSecret: (secret: string) => void;
}

const generateSecret = (length: number, uppercase: boolean, lowercase: boolean, numbers: boolean, symbols: boolean): string => {
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

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
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [secret, setSecret] = useState(() => generateSecret(32, true, true, true, true));
  const { copied, copy } = useClipboard();

  const generate = () => {
    setSecret(generateSecret(length, useUpper, useLower, useNumbers, useSymbols));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={460}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--vk-text)' }}>High-Entropy Generator</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)' }}>Cryptographically random client-side generation</p>
          </div>
          <button onClick={onClose} aria-label="Close generator" style={{ background: 'none', border: 'none', color: 'var(--vk-text-muted)', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div
          className="code-font"
          style={{
            background: '#07090e',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--vk-border)',
            wordBreak: 'break-all',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--vk-success)',
            fontSize: '0.9rem',
            marginBottom: '18px',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {secret}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--vk-text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Length</span>
              <strong style={{ color: 'var(--vk-accent)', fontFamily: 'monospace' }}>{length} characters</strong>
            </div>
            <input
              type="range"
              min="12"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--vk-accent)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: 'var(--vk-text-secondary)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} style={{ accentColor: 'var(--vk-accent)' }} /> A–Z (Upper)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} style={{ accentColor: 'var(--vk-accent)' }} /> a–z (Lower)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} style={{ accentColor: 'var(--vk-accent)' }} /> 0–9 (Numbers)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} style={{ accentColor: 'var(--vk-accent)' }} /> Symbols (!@#$)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={generate} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <Dices size={14} /> Regenerate
          </button>
          <button onClick={() => copy(secret)} className="btn btn-secondary">
            {copied ? <Check size={14} color="var(--vk-success)" /> : <Copy size={14} />}
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
        </div>
      </div>
    </Modal>
  );
};
