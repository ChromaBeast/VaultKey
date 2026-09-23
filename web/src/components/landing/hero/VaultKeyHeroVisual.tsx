import React from 'react';

export const VaultKeyHeroVisual: React.FC = () => (
  <div className="w-full min-w-0 max-w-xl rounded-2xl border border-white/10 bg-[#10151e] p-5 sm:p-7 shadow-2xl shadow-black/30">
    <p className="border-b border-white/10 pb-5 text-sm font-semibold text-foreground">From vault to app</p>

    <div className="grid grid-cols-1 items-center gap-3 py-7 sm:grid-cols-[1fr_auto_1fr] sm:gap-5">
      <div className="min-w-0 rounded-xl border border-white/10 bg-[#090c12] p-4 sm:p-5">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Stored in your vault</p>
        <p className="truncate text-sm font-medium text-foreground">Database password</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground" aria-label="Value hidden">••••••••••••</p>
      </div>

      <span className="text-xl text-primary sm:hidden" aria-hidden="true">↓</span>
      <span className="hidden text-xl text-primary sm:block" aria-hidden="true">→</span>

      <div className="min-w-0 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Given to your app</p>
        <p className="text-sm font-semibold text-foreground">When it runs</p>
        <p className="mt-1 text-xs text-muted-foreground">No project file needed</p>
      </div>
    </div>

  </div>
);
