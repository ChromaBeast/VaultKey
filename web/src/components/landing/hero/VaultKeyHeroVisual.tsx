import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto lg:max-w-none">
      {/* Terminal Mockup Window */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--vk-surface-1)] border border-[var(--vk-border)] shadow-2xl shadow-black/80 overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--vk-surface-2)] border-b border-[var(--vk-border)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--vk-danger)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--vk-warning)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--vk-success)]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--vk-text-muted)] font-mono">
            <Terminal className="w-3.5 h-3.5 text-[var(--vk-accent)]" />
            <span>vaultkey-runtime</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed space-y-3 text-left">
          <div className="flex items-center gap-2 text-[var(--vk-text)]">
            <span className="text-[var(--vk-accent)] font-bold">$</span>
            <span className="text-[var(--vk-text)] font-semibold">vaultkey run</span>
            <span className="text-[var(--vk-accent)]">--env=production</span>
            <span className="text-[var(--vk-text-muted)]">-- npm start</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-[var(--vk-success)]">
              <span>✓</span>
              <span>14 secrets injected into memory</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--vk-success)]">
              <span>✓</span>
              <span>Process started (PID 8192)</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--vk-text-muted)]">
              <span>✓</span>
              <span>Server listening on http://localhost:3000</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--vk-border)] flex items-center justify-between text-xs text-[var(--vk-text-muted)]">
            <div className="flex items-center gap-1.5 text-[var(--vk-success)]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Memory locked (zero disk footprint)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--vk-accent-dim)] border border-[rgba(91,141,239,0.25)] text-[var(--vk-accent)] font-medium font-mono">
              RAM PROTECTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
