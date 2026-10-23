import React, { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { NAV_GROUPS } from './docsData';

interface DocsLeftNavProps {
  activeSection: string;
  activeItem: string;
  onSelectItem: (sectionId: string, itemId: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const DocsLeftNav: React.FC<DocsLeftNavProps> = ({
  activeSection,
  activeItem,
  onSelectItem,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { id: 'python', label: 'Python (FastAPI, LangChain, Agents)', icon: '🐍' },
    { id: 'node', label: 'TypeScript / Node.js', icon: '⚡' },
    { id: 'cli', label: 'Go / CLI & MCP Subprocess', icon: '⚙️' },
  ];

  const currentLang = languages.find((l) => l.id === selectedLanguage) || languages[0];

  return (
    <aside className="docs-left-nav" aria-label="Documentation Navigation">
      {/* Target Language / Environment Selector */}
      <div className="docs-lang-selector-wrapper">
        <button
          type="button"
          className="docs-lang-selector-btn"
          onClick={() => setLangDropdownOpen((prev) => !prev)}
          aria-expanded={langDropdownOpen}
          aria-haspopup="true"
        >
          <span className="docs-lang-selector-icon">{currentLang.icon}</span>
          <span className="docs-lang-selector-label">{currentLang.id === 'python' ? 'Python' : currentLang.id === 'node' ? 'TypeScript' : 'Go / CLI'}</span>
          <ChevronDown size={13} className={`docs-chevron ml-auto ${langDropdownOpen ? 'is-open' : ''}`} />
        </button>

        {langDropdownOpen && (
          <div className="docs-lang-menu" role="menu">
            {languages.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`docs-lang-menu-item ${selectedLanguage === l.id ? 'is-active' : ''}`}
                role="menuitem"
                onClick={() => {
                  onSelectLanguage(l.id);
                  setLangDropdownOpen(false);
                }}
              >
                <span>{l.icon}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="docs-left-nav-groups">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="docs-nav-group">
            <div className="docs-nav-group-title">{group.label}</div>
            <ul className="docs-nav-group-list">
              {group.items.map((item) => {
                const isActive = activeItem === item.id || (activeSection === item.sectionId && !activeItem.includes('-'));
                if (item.external) {
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="docs-left-nav-link"
                      >
                        <span>{item.label}</span>
                        <ExternalLink size={12} className="docs-nav-external-icon ml-auto" />
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`docs-left-nav-link ${isActive ? 'is-active' : ''}`}
                      onClick={() => onSelectItem(item.sectionId, item.id)}
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
