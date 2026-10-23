import React from 'react';

export const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="docs-shell">
      <a className="docs-skip-link" href="#docs-main">Skip to content</a>
      <main id="docs-main">{children}</main>
    </div>
  );
};
