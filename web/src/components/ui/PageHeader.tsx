import React from 'react';
import { IconTile, type Tone } from './IconTile';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  icon,
  tone = 'blue',
  actions,
}) => {
  return (
    <header className="app-page-header">
      <div className="app-page-heading">
        <div className="app-page-title-row">
          {icon && <IconTile tone={tone}>{icon}</IconTile>}
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
