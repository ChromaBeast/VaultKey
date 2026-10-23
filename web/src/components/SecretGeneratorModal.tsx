import React, { useState } from 'react';
import { RefreshCw, Check, Copy, X } from 'lucide-react';
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
    <Modal label="Secret generator" isOpen={isOpen} onClose={onClose} width={460}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Secret generator</h3>
            <p className="text-xs text-muted-foreground">Cryptographically random client-side generation</p>
          </div>
          <button onClick={onClose} aria-label="Close generator" className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="font-mono bg-background p-3.5 rounded-lg border border-border break-all min-h-[60px] flex items-center justify-center text-emerald-400 text-sm mb-4 select-all">
          {secret}
        </div>

        <div className="flex flex-col gap-3.5 mb-5">
          <div>
            <div className="text-xs text-muted-foreground flex justify-between mb-1.5 font-medium">
              <span>Length</span>
              <strong className="text-primary font-mono">{length} characters</strong>
            </div>
            <input
              aria-label="Secret length"
              type="range"
              min="12"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="accent-primary" /> A-Z (Upper)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="accent-primary" /> a-z (Lower)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="accent-primary" /> 0-9 (Numbers)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="accent-primary" /> Symbols (!@#$)
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={generate} className="btn btn-secondary flex-1 justify-center">
            <RefreshCw size={13} /> Regenerate
          </button>
          <button onClick={() => void copy(secret)} className="btn btn-secondary">
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
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
