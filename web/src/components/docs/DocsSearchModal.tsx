import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Package, Bot, Zap, ShieldCheck, CornerDownLeft, X } from 'lucide-react';
import { DOC_SEARCH_INDEX, type SearchDocItem } from './docsData';

interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SearchDocItem) => void;
}

export const DocsSearchModal: React.FC<DocsSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const results = DOC_SEARCH_INDEX.filter((item) => {
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  const getCategoryIcon = (category: SearchDocItem['category']) => {
    switch (category) {
      case 'QUICKSTART': return <Terminal size={14} className="text-emerald-400" />;
      case 'CLI': return <Terminal size={14} className="text-teal-400" />;
      case 'SDK': return <Package size={14} className="text-sky-400" />;
      case 'MCP': return <Bot size={14} className="text-indigo-400" />;
      case 'API': return <Zap size={14} className="text-amber-400" />;
      case 'SECURITY': return <ShieldCheck size={14} className="text-purple-400" />;
      default: return <Search size={14} className="text-zinc-400" />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) {
        onSelect(results[activeIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleClose = () => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  };

  return (
    <div className="docs-search-backdrop" onClick={handleClose}>
      <div
        className="docs-search-dialog animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div className="docs-search-header">
          <Search size={18} className="docs-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="docs-search-input"
            placeholder="Search docs, MCP tools, commands, SDKs, or security specs..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              type="button"
              className="docs-search-clear"
              onClick={() => {
                setQuery('');
                setActiveIndex(0);
              }}
              aria-label="Clear query"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="docs-search-kbd">ESC</kbd>
        </div>

        <div className="docs-search-results">
          {results.length === 0 ? (
            <div className="docs-search-empty">
              <p>No results found for "{query}"</p>
              <span>Try searching for "mcp", "run_with_secrets", "cli", or "argon2id"</span>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  className={`docs-search-item ${isSelected ? 'is-active' : ''}`}
                  onClick={() => {
                    onSelect(item);
                    handleClose();
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className="docs-search-item-icon">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="docs-search-item-content">
                    <div className="docs-search-item-title-row">
                      <span className="docs-search-item-title">{item.title}</span>
                      <span className="docs-search-item-badge">{item.category}</span>
                    </div>
                    <p className="docs-search-item-desc">{item.description}</p>
                  </div>
                  {isSelected && (
                    <CornerDownLeft size={14} className="docs-search-item-enter" aria-hidden="true" />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="docs-search-footer">
          <div className="docs-search-footer-hint">
            <kbd>↑</kbd> <kbd>↓</kbd> navigate
          </div>
          <div className="docs-search-footer-hint">
            <kbd>↵</kbd> select
          </div>
          <div className="docs-search-footer-hint">
            <kbd>esc</kbd> close
          </div>
        </div>
      </div>
    </div>
  );
};
