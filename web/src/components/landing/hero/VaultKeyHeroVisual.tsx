import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto lg:max-w-none">
      {/* Terminal Mockup Window */}
      <div className="rounded-xl bg-[#0d1117] border border-white/10 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>vaultkey-runtime</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed space-y-3 text-left">
          <div className="flex items-center gap-2 text-foreground">
            <span className="text-primary font-bold">$</span>
            <span className="text-white font-semibold">vaultkey run</span>
            <span className="text-primary/90">--env=production</span>
            <span className="text-muted-foreground">-- npm start</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <span>✓</span>
              <span>14 secrets injected into memory</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span>✓</span>
              <span>Process started (PID 8192)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>✓</span>
              <span>Server listening on http://localhost:3000</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Memory locked (zero disk footprint)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-medium">
              RAM PROTECTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
