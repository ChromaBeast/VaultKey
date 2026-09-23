import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

export const VaultKeyHeroVisual: React.FC = () => (
  <div className="w-full min-w-0 max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8">
    <p className="border-b border-border pb-5 text-sm font-semibold text-foreground">From vault to app</p>

    <div className="grid grid-cols-1 items-center gap-5 pt-7 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
      <div className="min-w-0">
        <p className="mb-3 text-sm text-muted-foreground">Stored in your vault</p>
        <p className="text-base font-semibold text-foreground">Database password</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground" aria-label="Value hidden">••••••••••••</p>
      </div>

      <ArrowDown size={20} strokeWidth={1.75} className="text-primary sm:hidden" aria-hidden="true" />
      <ArrowRight size={20} strokeWidth={1.75} className="hidden text-primary sm:block" aria-hidden="true" />

      <div className="min-w-0">
        <p className="mb-3 text-sm text-muted-foreground">Given to your app</p>
        <p className="text-base font-semibold text-foreground">When it runs</p>
        <p className="mt-1 text-sm text-muted-foreground">No project file needed</p>
      </div>
    </div>
  </div>
);
