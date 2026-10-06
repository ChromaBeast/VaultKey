import React, { useEffect, useRef, useState } from 'react';

const COMMAND = 'vaultkey run --project=backend -- npm start';

export const RunCommand: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copyCommand = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(COMMAND);
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
        <code className="min-w-0 whitespace-pre-wrap break-words font-mono text-xs text-foreground sm:text-sm"><span className="text-primary">$</span> {COMMAND}</code>
        <button type="button" onClick={() => void copyCommand()} className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary" aria-label="Copy VaultKey command">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <span role="status" className="sr-only">{copied ? 'Command copied' : ''}</span>
      {copyError && <p role="alert" className="mt-3 text-sm text-muted-foreground">Could not copy. Select the command and copy it manually.</p>}
      <p className="mt-4 text-sm text-muted-foreground">Replace backend with your project. Use your usual start command after the two dashes.</p>
    </div>
  );
};
