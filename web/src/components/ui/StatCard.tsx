import React from 'react';
import { IconTile, type Tone } from './IconTile';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
  tone?: Tone;
  valueTone?: Tone;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, hint, icon, tone = 'blue', valueTone, className }) => (
  <div className={cn('glass flex flex-1 basis-[200px] flex-col gap-3.5 px-5 py-[18px]', className)}>
    <div className="flex items-center justify-between gap-3">
      <span className="code-font text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--vk-text-muted)]">{label}</span>
      <IconTile tone={tone} size="sm">{icon}</IconTile>
    </div>
    <div className={cn('font-[var(--font-display)] text-[1.85rem] font-extrabold leading-none tracking-tight', valueTone && `tone-${valueTone}`)}
      style={valueTone ? { color: 'var(--tone-text)' } : undefined}>{value}</div>
    {hint && <div className="text-xs text-[var(--vk-text-secondary)]">{hint}</div>}
  </div>
);
