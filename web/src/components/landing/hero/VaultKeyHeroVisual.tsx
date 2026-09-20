import React from 'react';
import { Terminal, Lock } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="w-full max-w-lg lg:max-w-none">
      {/* Terminal Mockup Window */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--vk-surface-1)] border border-[var(--vk-border)] shadow-2xl shadow-black/80 overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--vk-surface-2)] border-b border-[var(--vk-border)]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--vk-text-muted)] font-mono">
            <Terminal className="w-3.5 h-3.5 text-[var(--vk-accent)]" />
            <span>vaultkey-runtime · pid 8192</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--vk-success)] bg-[var(--vk-success-dim)] px-2 py-0.5 rounded border border-[rgba(34,197,94,0.25)]">
            <Lock className="w-3 h-3" />
            <span>MLOCK</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed space-y-4 text-left">
          {/* CLI Invocation */}
          <div className="flex items-center gap-2 text-[var(--vk-text)]">
            <span className="text-[var(--vk-accent)] font-bold select-none">$</span>
            <span className="text-[var(--vk-text)] font-semibold">vaultkey run</span>
            <span className="text-[var(--vk-accent)]">--env=production</span>
            <span className="text-[var(--vk-text-muted)]">-- npm start</span>
          </div>

          {/* Execution Telemetry Logs */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[var(--vk-success)]">
              <span className="select-none">✓</span>
              <span>14 secrets decrypted into process RAM (1.2ms)</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--vk-success)]">
              <span className="select-none">✓</span>
              <span>Memory locked via mlock(2) · zero disk footprint</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--vk-text-muted)]">
              <span className="select-none">✓</span>
              <span>Spawned isolated child process (PID 8192)</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--vk-text-muted)]">
              <span className="select-none">✓</span>
              <span>Server listening on http://localhost:3000</span>
            </div>
          </div>

          {/* Real-time Status & Metrics Bar */}
          <div className="pt-3.5 border-t border-[var(--vk-border)] grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="bg-[var(--vk-surface-2)] p-2 rounded-[var(--radius-sm)] border border-[var(--vk-border)]">
              <div className="text-[var(--vk-text-muted)]">Disk Leak</div>
              <div className="text-[var(--vk-success)] font-bold mt-0.5">0 bytes</div>
            </div>
            <div className="bg-[var(--vk-surface-2)] p-2 rounded-[var(--radius-sm)] border border-[var(--vk-border)]">
              <div className="text-[var(--vk-text-muted)]">Cipher</div>
              <div className="text-[var(--vk-text)] font-bold mt-0.5">Argon2id</div>
            </div>
            <div className="bg-[var(--vk-surface-2)] p-2 rounded-[var(--radius-sm)] border border-[var(--vk-border)]">
              <div className="text-[var(--vk-text-muted)]">RAM State</div>
              <div className="text-[var(--vk-accent)] font-bold mt-0.5">Protected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
