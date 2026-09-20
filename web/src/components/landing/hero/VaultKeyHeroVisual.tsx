import React from 'react';
import { Terminal, Lock } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="w-full max-w-lg lg:max-w-none">
      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-2xl shadow-black/80">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/80 border-b border-border">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
          </div>
          {/* Session label */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Terminal size={12} className="text-primary" />
            vaultkey-runtime · pid 8192
          </div>
          {/* RAM badge */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <Lock size={10} />
            MLOCK
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed space-y-4 text-left">
          {/* Command */}
          <div className="flex gap-2 items-center text-foreground font-medium">
            <span className="text-primary font-bold select-none">$</span>
            <span className="font-semibold">vaultkey run</span>
            <span className="text-primary">--env=production</span>
            <span className="text-muted-foreground">-- npm start</span>
          </div>

          {/* Logs */}
          <div className="flex flex-col gap-2 text-xs">
            {[
              { text: '14 secrets decrypted into process RAM (1.2ms)', success: true },
              { text: 'Memory locked via mlock(2) · zero disk footprint', success: true },
              { text: 'Spawned isolated child process (PID 8192)', success: false },
              { text: 'Server listening on http://localhost:3000', success: false },
            ].map(({ text, success }, i) => (
              <div key={i} className={`flex items-start gap-2 ${success ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                <span className="shrink-0 select-none">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-3.5 text-center text-xs">
            {[
              { label: 'Disk Leak', value: '0 bytes', textClass: 'text-emerald-400' },
              { label: 'Cipher', value: 'AES-256', textClass: 'text-foreground' },
              { label: 'RAM State', value: 'Protected', textClass: 'text-primary' },
            ].map(({ label, value, textClass }) => (
              <div key={label} className="bg-secondary/60 p-2 rounded-md border border-border">
                <div className="text-[10px] text-muted-foreground">{label}</div>
                <div className={`font-bold text-xs mt-0.5 ${textClass}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
