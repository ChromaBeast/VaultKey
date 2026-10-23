import React from 'react';
import { Lightbulb, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DocsCalloutProps {
  type?: 'tip' | 'info' | 'warning' | 'security';
  title?: string;
  children: React.ReactNode;
}

export const DocsCallout: React.FC<DocsCalloutProps> = ({
  type = 'tip',
  title,
  children,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="docs-callout-icon docs-callout-icon--tip" size={18} aria-hidden="true" />;
      case 'info':
        return <Info className="docs-callout-icon docs-callout-icon--info" size={18} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="docs-callout-icon docs-callout-icon--warning" size={18} aria-hidden="true" />;
      case 'security':
        return <ShieldCheck className="docs-callout-icon docs-callout-icon--security" size={18} aria-hidden="true" />;
    }
  };

  return (
    <div className={`docs-callout docs-callout--${type}`} role="note">
      <div className="docs-callout-aside">{getIcon()}</div>
      <div className="docs-callout-body">
        {title && <h4 className="docs-callout-title">{title}</h4>}
        <div className="docs-callout-content">{children}</div>
      </div>
    </div>
  );
};
