import React from 'react';
import { DevWorkflowTabs } from './DevWorkflowTabs';

export const DevExperienceSection: React.FC = () => {
  return (
    <section id="workflow" className="section-shell">
      <div className="section-header">
        <span className="section-eyebrow">
          Workflows
        </span>
        <h2 className="section-title">
          From dev to prod in one command.
        </h2>
      </div>

      <DevWorkflowTabs />
    </section>
  );
};
