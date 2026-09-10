import React from 'react';

interface PageHeaderProps {
  breadcrumb?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  title,
  description,
  badge,
  actions,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        {breadcrumb && (
          <div
            style={{
              fontSize: '0.72rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--vk-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '4px',
              fontWeight: 600,
            }}
          >
            {breadcrumb}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p style={{ color: 'var(--vk-text-secondary)', fontSize: '0.875rem', marginTop: '4px', maxWidth: '640px' }}>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
};
