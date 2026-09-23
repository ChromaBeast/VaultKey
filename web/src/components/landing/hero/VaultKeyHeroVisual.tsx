import React from 'react';
import { Terminal, Lock } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl">
      {/* Ambient blue aura behind terminal */}
      <div
        className="absolute -inset-3 bg-gradient-to-tr from-primary/30 via-sky-500/15 to-transparent rounded-3xl blur-2xl -z-10 opacity-70"
        aria-hidden="true"
      />

      {/* Double-bezel outer shell */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-white/[0.1] via-white/[0.02] to-transparent border border-white/[0.08] shadow-2xl shadow-black/90">
        <div className="rounded-xl bg-[#0a0d14] border border-border overflow-hidden">
          {/* Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#111724] border-b border-border/80">
            {/* Traffic lights */}
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/85 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85 block" />
            </div>
            {/* Session label */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground font-medium">
              <Terminal size={13} className="text-primary" />
              vaultkey · runtime
            </div>
            {/* RAM badge */}
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
              <Lock size={10} />
              MLOCK
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed space-y-4 text-left">
            {/* Command */}
            <div className="flex gap-2.5 items-center text-foreground font-medium flex-wrap">
              <span className="text-primary font-bold select-none">$</span>
              <span className="font-semibold text-white">vaultkey run</span>
              <span className="text-muted-foreground">-- npm start</span>
            </div>

            {/* Logs */}
            <div className="flex flex-col gap-2.5 text-xs">
              {[
                { text: 'Session authenticated', success: true },
                { text: 'Secrets loaded into process memory', success: true },
                { text: 'Plaintext not written to disk', success: true },
                { text: 'Starting app…', success: false },
              ].map(({ text, success }, i) => (
                <div key={i} className={`flex items-start gap-2.5 ${success ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                  <span className="shrink-0 select-none font-bold">✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 border-t border-border/80 pt-5 pb-1 text-center">
              {[
                { label: 'Stored values', value: 'Encrypted', textClass: 'text-emerald-400' },
                { label: 'Encryption', value: 'AES-256-GCM', textClass: 'text-foreground' },
                { label: 'Secrets', value: 'In memory', textClass: 'text-primary' },
              ].map(({ label, value, textClass }) => (
                <div key={label} className="bg-secondary/80 p-3 rounded-xl border border-border/70">
                  <div className="text-xs uppercase font-mono text-muted-foreground tracking-wider mb-1">{label}</div>
                  <div className={`font-bold text-xs ${textClass}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
