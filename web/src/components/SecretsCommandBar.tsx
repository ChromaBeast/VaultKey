import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';
import { formatSecretsCommand } from '../lib/dx';

interface SecretsCommandBarProps {
  project: string;
  initialEnv?: string;
}

export const SecretsCommandBar: React.FC<SecretsCommandBarProps> = ({
  project,
  initialEnv = 'production',
}) => {
  const [mode, setMode] = useState<'run' | 'pull'>('run');
  const [selectedEnv, setSelectedEnv] = useState(initialEnv);
  const { copied, copy } = useClipboard();

  const command = formatSecretsCommand(mode, project, selectedEnv);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2 mb-5 rounded-lg border border-border bg-card/60 text-xs font-mono transition-all duration-150"
      role="region"
      aria-label="VaultKey CLI Quick Copy"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Terminal size={14} className="text-primary shrink-0" aria-hidden="true" />
        <span className="text-primary font-bold shrink-0">$</span>
        <code className="text-muted-foreground select-all truncate text-xs">
          <span className="text-foreground">{mode === 'run' ? 'vaultkey run' : 'vaultkey pull'}</span>
          {' --project='}
          <span className="text-emerald-400 font-semibold">{project}</span>
          {' --env='}
          <span className="text-emerald-400 font-semibold">{selectedEnv}</span>
          {mode === 'run' && <span className="text-muted-foreground"> -- &lt;cmd&gt;</span>}
        </code>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div
          role="group"
          aria-label="Target Environment"
          className="flex items-center rounded-md border border-border bg-background/50 p-0.5 text-[11px] font-sans"
        >
          {(['production', 'staging', 'development'] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setSelectedEnv(e)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                selectedEnv === e
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {e === 'production' ? 'prod' : e === 'staging' ? 'stage' : 'dev'}
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label="Command Mode"
          className="flex items-center rounded-md border border-border bg-background/50 p-0.5 text-[11px] font-sans"
        >
          <button
            type="button"
            onClick={() => setMode('run')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === 'run'
                ? 'bg-secondary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            run
          </button>
          <button
            type="button"
            onClick={() => setMode('pull')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === 'pull'
                ? 'bg-secondary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            pull
          </button>
        </div>

        <button
          type="button"
          onClick={() => void copy(command)}
          className="btn btn-secondary text-xs px-2.5 py-1 inline-flex items-center gap-1.5"
          aria-label={copied ? 'Copied command to clipboard' : 'Copy command to clipboard'}
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy Command'}</span>
        </button>
      </div>
    </div>
  );
};
