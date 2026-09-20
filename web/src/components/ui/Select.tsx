import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, disabled, children, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full bg-[var(--vk-surface-1)] text-[var(--vk-text)] border border-[var(--vk-border)] rounded-[var(--radius-input)] text-sm transition-colors duration-150 ease-out outline-none appearance-none cursor-pointer',
            'px-3.5 py-2 pr-9',
            'focus:border-[var(--vk-border-focus)] focus:ring-1 focus:ring-[var(--vk-border-focus)]',
            error && 'border-[var(--vk-danger)] focus:border-[var(--vk-danger)] focus:ring-[var(--vk-danger)]',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--vk-surface-2)]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <ChevronDown className="w-4 h-4" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[var(--vk-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
