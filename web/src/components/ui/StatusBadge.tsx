import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  showDot?: boolean;
}

const VARIANT_MAP: Record<StatusVariant, { bg: string; color: string; border: string; dot: string }> = {
  success: {
    bg: 'var(--vk-success-dim)',
    color: 'var(--vk-success)',
    border: 'rgba(74, 222, 128, 0.25)',
    dot: 'var(--vk-success)',
  },
  warning: {
    bg: 'var(--vk-warning-dim)',
    color: 'var(--vk-warning)',
    border: 'rgba(245, 158, 11, 0.25)',
    dot: 'var(--vk-warning)',
  },
  danger: {
    bg: 'var(--vk-danger-dim)',
    color: 'var(--vk-danger)',
    border: 'rgba(248, 113, 113, 0.25)',
    dot: 'var(--vk-danger)',
  },
  accent: {
    bg: 'var(--vk-accent-dim)',
    color: 'var(--vk-accent)',
    border: 'var(--vk-border-focus)',
    dot: 'var(--vk-accent)',
  },
  neutral: {
    bg: 'var(--vk-neutral-dim)',
    color: 'var(--vk-text-secondary)',
    border: 'var(--vk-border)',
    dot: 'var(--vk-text-muted)',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  showDot = false,
}) => {
  const styles = VARIANT_MAP[variant];

  return (
    <span
      className="badge"
      style={{
        background: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
    >
      {showDot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: styles.dot,
            display: 'inline-block',
          }}
        />
      )}
      {label}
    </span>
  );
};
