import React from 'react';

interface KeyboardHintProps {
  label?: string;
  style?: React.CSSProperties;
}

export const KeyboardHint: React.FC<KeyboardHintProps> = ({
  label = 'Or Press Enter',
  style,
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--vk-text-muted)',
        fontSize: '0.78rem',
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '20px',
          height: '20px',
          padding: '0 4px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          fontSize: '0.72rem',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--vk-text-secondary)',
          lineHeight: 1,
        }}
      >
        ↵
      </span>
      <span>{label}</span>
    </div>
  );
};
