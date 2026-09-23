import React from 'react';
import { DevWorkflowTabs } from './DevWorkflowTabs';

export const DevExperienceSection: React.FC = () => {
  return (
    <section id="workflow" className="section-shell">
      <div className="section-header">
        <h2 className="section-title">
          One command. Any environment.
        </h2>
      </div>

      <DevWorkflowTabs />
    </section>
  );
};
