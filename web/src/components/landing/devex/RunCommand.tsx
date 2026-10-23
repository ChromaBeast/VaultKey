import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../../../hooks/useClipboard';

const COMMAND = 'vaultkey run --project=backend -- npm start';

export const RunCommand: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copyCommand = async () => {
    setCopyError(false);
    try {
      if (!await copyText(COMMAND)) throw new Error("Copy failed");
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <code className="min-w-0 whitespace-pre-wrap break-words font-mono text-xs text-foreground sm:text-sm"><span className="text-primary font-bold">$</span> {COMMAND}</code>
        <button
          type="button"
          onClick={() => void copyCommand()}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-150 active:scale-[0.98]"
          aria-label="Copy VaultKey command"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-muted-foreground" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <span role="status" className="sr-only">{copied ? 'Command copied' : ''}</span>
      {copyError && <p role="alert" className="mt-3 text-sm text-muted-foreground">Could not copy. Select the command and copy it manually.</p>}
      <p className="mt-4 text-sm text-muted-foreground">Replace backend with your project. Use your usual start command after the two dashes.</p>
    </div>
  );
};
