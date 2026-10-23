import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  mono?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, mono = false, disabled, rows = 3, ...props }, ref) => {
    const errorId = React.useId();
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={[props["aria-describedby"], error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
          rows={rows}
          className={cn(
            'w-full bg-[var(--vk-surface-1)] text-[var(--vk-text)] border border-[var(--vk-border)] rounded-[var(--radius-input)] text-sm transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vk-accent)] placeholder:text-[var(--vk-text-muted)]',
            'px-3.5 py-2.5 resize-y',
            mono && 'font-mono text-xs',
            'focus:border-[var(--vk-border-focus)] focus:ring-1 focus:ring-[var(--vk-border-focus)]',
            error && 'border-[var(--vk-danger)] focus:border-[var(--vk-danger)] focus:ring-[var(--vk-danger)]',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--vk-surface-2)]',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-[var(--vk-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
