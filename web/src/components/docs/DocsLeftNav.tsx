import React from 'react';
import { NAV_GROUPS } from './docsData';

interface DocsLeftNavProps {
  activeSection: string;
  onSelectItem: (sectionId: string) => void;
}

export const DocsLeftNav: React.FC<DocsLeftNavProps> = ({
  activeSection,
  onSelectItem,
}) => {
  return (
    <aside className="docs-left-nav" aria-label="Documentation Navigation">
      <nav className="docs-left-nav-groups">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="docs-nav-group">
            <div className="docs-nav-group-title">{group.label}</div>
            <ul className="docs-nav-group-list">
              {group.items.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`docs-left-nav-link ${isActive ? 'is-active' : ''}`}
                      onClick={() => onSelectItem(item.sectionId)}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      <span>{item.label}</span>
                      {item.badge && <span className="docs-nav-badge">{item.badge}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
