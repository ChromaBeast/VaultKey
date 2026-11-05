import React, { useEffect, useRef, useState } from 'react';
import { Bot, Check, Copy, Lock, ShieldCheck } from 'lucide-react';
import { copyText } from '../../../hooks/useClipboard';
import { IconTile } from '@/components/ui';

const ROWS: { key: string; version: string; role: string; tone: string }[] = [
  { key: 'STRIPE_SECRET_KEY', version: 'v4', role: 'write', tone: 'green' },
  { key: 'DATABASE_URL', version: 'v7', role: 'admin', tone: 'amber' },
  { key: 'SENDGRID_API_KEY', version: 'v2', role: 'read', tone: 'blue' },
  { key: 'JWT_SIGNING_SECRET', version: 'v1', role: 'write', tone: 'green' },
];

const COMMAND = 'vaultkey run --project=backend -- npm start';

/** Static product preview: a terminal run plus the secrets it injected. Sample data only. */
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
  <div className="hero-terminal-wrap">
    <figure className="hero-terminal" aria-label="Example: vaultkey run injecting twelve secrets into a process">
      <div className="hero-terminal-bar" aria-hidden="true">
        <i style={{ background: 'var(--danger)' }} /><i style={{ background: 'var(--warning)' }} /><i style={{ background: 'var(--success)' }} />
        <span>backend · production</span>
      </div>
      <div className="hero-terminal-body">
        <p className="cmd">
          <span><b style={{ color: 'var(--cyan)' }}>$</b> {COMMAND}</span>
          <button type="button" onClick={() => void copy()} aria-label="Copy command">
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </p>
        <span role="status" className="sr-only">{copied ? 'Command copied' : ''}</span>
        <p className="ok"><Check size={15} aria-hidden="true" /> 12 secrets decrypted in memory</p>
        <p className="ok"><Check size={15} aria-hidden="true" /> injected into process env · nothing written to disk</p>
        <p className="muted">&gt; server listening on :3000</p>
      </div>
      <ul className="hero-terminal-rows">
        {ROWS.map((row) => (
          <li key={row.key}>
            <span className="key"><Lock size={14} aria-hidden="true" /><code>{row.key}</code><em>••••••••••</em></span>
            <span className="meta"><code>{row.version}</code><span className={`badge badge-tone tone-${row.tone}`}>{row.role}</span></span>
          </li>
        ))}
      </ul>
    </figure>
    <div className="hero-chip hero-chip-agent tone-violet">
      <IconTile tone="violet" size="sm"><Bot size={16} /></IconTile>
      <span><strong>Claude Code connected</strong><small>keys never enter context</small></span>
    </div>
    <div className="hero-chip hero-chip-audit tone-green">
      <IconTile tone="green" size="sm"><ShieldCheck size={16} /></IconTile>
      <span><strong>Audit chain verified</strong><small>HMAC-SHA256 · 1,284 entries</small></span>
    </div>
  </div>
  );
};
