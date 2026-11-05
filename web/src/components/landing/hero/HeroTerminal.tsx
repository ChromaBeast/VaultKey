import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../../../hooks/useClipboard';

const COMMAND = 'vaultkey run --project=backend -- npm start';
const VARIABLES = ['STRIPE_SECRET_KEY', 'DATABASE_URL', 'SENDGRID_API_KEY', 'JWT_SIGNING_SECRET'];

/** Static product preview: one terminal run and the variables it injected. Sample data only. */
export const HeroTerminal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    if (!await copyText(COMMAND)) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <figure className="hero-terminal" aria-label="Example: vaultkey run injecting four secrets into a process">
      <figcaption className="hero-terminal-head">
        <span>Terminal</span>
        <button type="button" onClick={() => void copy()} aria-label="Copy command">
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre className="hero-terminal-body">
        <code>
          <span className="line"><span className="prompt">$</span> {COMMAND}</span>
          <span className="line gap ok"><Check size={14} aria-hidden="true" /> Decrypted 4 secrets in memory</span>
          <span className="line ok"><Check size={14} aria-hidden="true" /> Injected into the process, nothing written to disk</span>
          {VARIABLES.map((name) => (
            <span key={name} className="line env"><span>{name}</span><span aria-hidden="true">••••••••</span></span>
          ))}
          <span className="line gap muted">Server listening on :3000</span>
        </code>
      </pre>
      <span role="status" className="sr-only">{copied ? 'Command copied' : ''}</span>
    </figure>
  );
};
