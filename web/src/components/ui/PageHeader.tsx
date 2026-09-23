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
    <header className="app-page-header">
      <div className="app-page-heading">
        {breadcrumb && (
          <div className="app-page-eyebrow">
            {breadcrumb}
          </div>
        )}
        <div className="app-page-title-row">
          <h1>
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="app-page-description">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="app-page-actions">
          {actions}
        </div>
      )}
    </header>
  );
};
