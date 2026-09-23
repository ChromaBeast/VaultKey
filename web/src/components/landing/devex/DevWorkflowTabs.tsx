import React, { useState } from 'react';

const COMMAND = 'vaultkey run -- npm start';

export const DevWorkflowTabs: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground sm:text-sm"><span className="text-primary">$</span> {COMMAND}</code>
        <button type="button" onClick={() => void copyCommand()} className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary" aria-label="Copy VaultKey command">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Use your usual start command after the two dashes.</p>
    </div>
  );
};
