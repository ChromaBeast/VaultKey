import React from 'react';
import { cn } from '@/lib/utils';
import { IconTile, type Tone } from './IconTile';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  tone = 'blue',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[var(--radius-lg)] border border-dashed border-[var(--vk-border-strong)] bg-[var(--vk-surface-1)]',
        className
      )}
    >
      {icon && <IconTile tone={tone} size="lg" boxed className="mb-4">{icon}</IconTile>}
      <h3 className="text-base font-semibold text-[var(--vk-text)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--vk-text-secondary)] max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
