import React from 'react';
import { AlignLeft } from 'lucide-react';

export interface TocHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

interface DocsRightTocProps {
  headings: TocHeading[];
  activeId: string;
  onSelectHeading: (id: string) => void;
}

export const DocsRightToc: React.FC<DocsRightTocProps> = ({
  headings,
  activeId,
  onSelectHeading,
}) => {
  return (
    <aside className="docs-right-toc" aria-label="Table of contents">
      <div className="docs-right-toc-sticky">
        <div className="docs-right-toc-header">
          <AlignLeft size={14} className="text-muted-foreground" aria-hidden="true" />
          <span>On this page</span>
        </div>

        <nav className="docs-right-toc-nav">
          <ul className="docs-right-toc-list">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <li
                  key={heading.id}
                  className={`docs-right-toc-item docs-right-toc-item--level-${heading.level}`}
                >
                  <button
                    type="button"
                    className={`docs-right-toc-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectHeading(heading.id)}
                  >
                    {heading.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
