import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[var(--radius-lg)] border border-[var(--vk-border)] bg-[var(--vk-surface-1)]',
        className
      )}
    >
      {icon && (
        <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--vk-surface-2)] text-[var(--vk-accent)] border border-[var(--vk-border)]">
          {icon}
        </div>
      )}
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
