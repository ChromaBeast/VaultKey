import React from 'react';
import { RunCommand } from './RunCommand';

export const DevExperienceSection: React.FC = () => {
  return (
    <section id="workflow" className="section-shell">
      <div className="section-header">
        <h2 className="section-title">Run your app with one command.</h2>
        <p className="section-subtitle">VaultKey gives your app the passwords and keys it needs when you start it.</p>
      </div>

      <RunCommand />
    </section>
  );
};
