import React from 'react';

export interface StepItem {
  number: number;
  title: string;
  description: React.ReactNode;
  content?: React.ReactNode;
}

interface DocsStepListProps {
  steps: StepItem[];
}

export const DocsStepList: React.FC<DocsStepListProps> = ({ steps }) => {
  return (
    <div className="docs-step-list">
      {steps.map((step) => (
        <div key={step.number} className="docs-step-item">
          <div className="docs-step-badge-col">
            <div className="docs-step-badge">{step.number}</div>
            <div className="docs-step-line" />
          </div>
          <div className="docs-step-body">
            <h4 className="docs-step-title">{step.title}</h4>
            <div className="docs-step-desc">{step.description}</div>
            {step.content && <div className="docs-step-content">{step.content}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
