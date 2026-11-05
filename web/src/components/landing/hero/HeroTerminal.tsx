import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { copyText } from '../../../hooks/useClipboard';
import { useTerminalPlayback } from '../../../hooks/useTerminalPlayback';

const COMMAND = 'vaultkey run --project=backend -- npm start';
const VARIABLES = ['STRIPE_SECRET_KEY', 'DATABASE_URL', 'SENDGRID_API_KEY', 'JWT_SIGNING_SECRET'];
// Output lines in order: two status lines, one per variable, then the server line.
const LINE_COUNT = 2 + VARIABLES.length + 1;

const cls = (shown: number, index: number, base: string) => `${base} reveal${shown > index ? ' is-in' : ''}`;

/** Product preview: one terminal run and the variables it injected. Plays once. Sample data only. */
export const HeroTerminal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { element, typed, shown, finished, typing, canReplay, replay } = useTerminalPlayback(COMMAND, LINE_COUNT);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    if (!await copyText(COMMAND)) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <figure ref={element} className="hero-terminal" aria-label="Example: vaultkey run injecting four secrets into a process">
      <figcaption className="hero-terminal-head">
        <span>Terminal</span>
        <span className="hero-terminal-actions">
          {canReplay && (
            <button type="button" onClick={replay} aria-label="Replay animation" disabled={!finished} className="is-icon">
              <RotateCcw size={14} aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={() => void copy()} aria-label="Copy command">
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </figcaption>
      <pre className="hero-terminal-body">
        <code>
          <span className="line">
            <span className="prompt">$</span>
            {/* The full command stays in the DOM (hidden glyphs keep the layout still) so screen readers and crawlers see it. */}
            <span><span>{COMMAND.slice(0, typed)}</span>{typing && <span className="cursor" aria-hidden="true" />}<span className="untyped">{COMMAND.slice(typed)}</span></span>
          </span>
          <span className={cls(shown, 0, 'line gap ok')}><Check size={14} aria-hidden="true" /> Decrypted 4 secrets in memory</span>
          <span className={cls(shown, 1, 'line ok')}><Check size={14} aria-hidden="true" /> Injected into the process, nothing written to disk</span>
          {VARIABLES.map((name, i) => (
            <span key={name} className={cls(shown, 2 + i, 'line env')}><span>{name}</span><span aria-hidden="true">••••••••</span></span>
          ))}
          <span className={cls(shown, 2 + VARIABLES.length, 'line gap muted')}>Server listening on :3000</span>
        </code>
      </pre>
      <span role="status" className="sr-only">{copied ? 'Command copied' : ''}</span>
    </figure>
  );
};
