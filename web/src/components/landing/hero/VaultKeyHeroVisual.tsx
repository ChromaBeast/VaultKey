import React from 'react';
import { Terminal, Lock } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="w-full max-w-xl">
      {/* Double-bezel outer shell */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] shadow-2xl shadow-black/80">
        <div className="rounded-xl bg-[#0b0e14] border border-border/90 overflow-hidden">
          {/* Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111622] border-b border-border/80">
            {/* Traffic lights */}
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 block" />
            </div>
            {/* Session label */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground font-medium">
              <Terminal size={13} className="text-primary" />
              vaultkey-runtime · pid 8192
            </div>
            {/* RAM badge */}
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
              <Lock size={10} />
              MLOCK
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed space-y-4 text-left">
            {/* Command */}
            <div className="flex gap-2 items-center text-foreground font-medium flex-wrap">
              <span className="text-primary font-bold select-none">$</span>
              <span className="font-semibold">vaultkey run</span>
              <span className="text-primary">--env=production</span>
              <span className="text-muted-foreground">-- npm start</span>
            </div>

            {/* Logs */}
            <div className="flex flex-col gap-2.5 text-xs">
              {[
                { text: '14 secrets decrypted into process RAM (1.2ms)', success: true },
                { text: 'Memory locked via mlock(2) · zero disk footprint', success: true },
                { text: 'Spawned isolated child process (PID 8192)', success: false },
                { text: 'Server listening on http://localhost:3000', success: false },
              ].map(({ text, success }, i) => (
                <div key={i} className={`flex items-start gap-2.5 ${success ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                  <span className="shrink-0 select-none font-bold">✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 border-t border-border/80 pt-4 text-center">
              {[
                { label: 'Disk Leak', value: '0 bytes', textClass: 'text-emerald-400' },
                { label: 'Cipher', value: 'AES-256', textClass: 'text-foreground' },
                { label: 'RAM State', value: 'Protected', textClass: 'text-primary' },
              ].map(({ label, value, textClass }) => (
                <div key={label} className="bg-secondary/70 p-2.5 rounded-lg border border-border/60">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">{label}</div>
                  <div className={`font-bold text-xs mt-1 ${textClass}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
