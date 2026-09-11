import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Terminal, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const floatingBadgeVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const floatingBadgeVariantsAlt: Variants = {
  animate: {
    y: [0, 8, 0],
    transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const VaultKeyHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none pt-4 pb-6">
      {/* Ambient Glows */}
      <div className="absolute -top-8 -left-8 w-52 h-52 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-56 h-56 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

      {/* Main Terminal Mockup Window */}
      <div className="relative rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>vaultkey-runtime — bash</span>
          </div>
          <div className="w-12" />
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed space-y-2.5 text-left">
          <div className="flex items-center gap-2 text-foreground/90 flex-wrap">
            <span className="text-primary font-bold">$</span>
            <span className="text-white font-semibold">vaultkey run</span>
            <span className="text-primary/90">--env=production</span>
            <span className="text-muted-foreground">-- node server.js</span>
          </div>

          <div className="pt-2 space-y-1.5 text-muted-foreground text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 text-cyan-300/90">
              <span className="text-muted-foreground/60">[00:00.02]</span>
              <span>⚡ Argon2id key derivation (64MB RAM) ...</span>
              <span className="text-primary font-bold">OK</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400/90">
              <span className="text-muted-foreground/60">[00:00.04]</span>
              <span>🔒 14 secrets injected into RAM via AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300/90">
              <span className="text-muted-foreground/60">[00:00.07]</span>
              <span>🛡️ Zero plaintext on disk · RAM zeroed on exit</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-muted-foreground/60">[00:00.09]</span>
              <span>📜 Audit ledger signed: HMAC-SHA256 (7a9e...3d2f)</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] sm:text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Server listening on :8080 (PID 4821)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/25 text-primary font-bold">
              RAM PROTECTED
            </span>
          </div>
        </div>
      </div>

      {/* Floating Badge 1: Top Right */}
      <motion.div
        className="absolute -top-3 -right-2 sm:-right-4 bg-card/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex items-center gap-3 hidden sm:flex z-10"
        variants={floatingBadgeVariants}
        animate="animate"
      >
        <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-foreground">Zero-Disk RAM Lock</p>
          <p className="text-[10px] text-muted-foreground">No plaintext touches storage</p>
        </div>
      </motion.div>

      {/* Floating Badge 2: Bottom Left */}
      <motion.div
        className="absolute -bottom-3 -left-2 sm:-left-4 bg-card/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex items-center gap-3 hidden sm:flex z-10"
        variants={floatingBadgeVariantsAlt}
        animate="animate"
      >
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-foreground">Argon2id + AES-256-GCM</p>
          <p className="text-[10px] text-muted-foreground">Memory-hard cryptographic core</p>
        </div>
      </motion.div>
    </div>
  );
};
