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
    border: 'rgba(67, 211, 158, 0.25)',
    dot: 'var(--vk-success)',
  },
  warning: {
    bg: 'var(--vk-warning-dim)',
    color: 'var(--vk-warning)',
    border: 'rgba(244, 199, 106, 0.25)',
    dot: 'var(--vk-warning)',
  },
  danger: {
    bg: 'var(--vk-danger-dim)',
    color: 'var(--vk-danger)',
    border: 'rgba(255, 107, 122, 0.25)',
    dot: 'var(--vk-danger)',
  },
  accent: {
    bg: 'var(--vk-accent-dim)',
    color: 'var(--vk-accent)',
    border: 'rgba(115, 230, 255, 0.25)',
    dot: 'var(--vk-accent)',
  },
  neutral: {
    bg: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--vk-text-secondary)',
    border: 'var(--vk-border)',
    dot: 'var(--vk-text-muted)',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  showDot = true,
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
