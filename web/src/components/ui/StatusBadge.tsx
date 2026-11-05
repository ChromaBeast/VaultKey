import React from 'react';
import { cn } from '@/lib/utils';
import type { Tone } from './IconTile';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'accent' | Exclude<Tone, 'blue' | 'green' | 'amber' | 'red'>;

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  showDot?: boolean;
}

const TONE_CLASS: Record<StatusVariant, string> = {
  success: 'badge-tone tone-green',
  warning: 'badge-tone tone-amber',
  danger: 'badge-tone tone-red',
  accent: 'badge-tone tone-blue',
  violet: 'badge-tone tone-violet',
  cyan: 'badge-tone tone-cyan',
  fuchsia: 'badge-tone tone-fuchsia',
  rose: 'badge-tone tone-rose',
  neutral: 'badge-neutral',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant = 'neutral', showDot = false }) => (
  <span className={cn('badge', TONE_CLASS[variant], showDot && 'badge-dot')}>{label}</span>
);
