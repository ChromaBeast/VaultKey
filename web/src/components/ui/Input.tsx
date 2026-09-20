import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  mono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, error, mono = false, disabled, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full bg-[var(--vk-surface-1)] text-[var(--vk-text)] border border-[var(--vk-border)] rounded-[var(--radius-input)] text-sm transition-colors duration-150 ease-out outline-none placeholder:text-[var(--vk-text-muted)]',
            'px-3.5 py-2',
            icon && 'pl-9',
            mono && 'font-mono text-xs',
            'focus:border-[var(--vk-border-focus)] focus:ring-1 focus:ring-[var(--vk-border-focus)]',
            error && 'border-[var(--vk-danger)] focus:border-[var(--vk-danger)] focus:ring-[var(--vk-danger)]',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--vk-surface-2)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[var(--vk-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
