import React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Kbd: React.FC<KbdProps> = ({ children, className, ...props }) => {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center font-mono text-[10px] uppercase font-semibold',
        'px-1.5 py-0.5 rounded-[var(--radius-sm)]',
        'bg-[var(--vk-surface-2)] text-[var(--vk-text-secondary)] border border-[var(--vk-border)] shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
};
