import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, ChevronDown, Link2, FileText } from 'lucide-react';
import { copyText } from '../../hooks/useClipboard';

interface DocsCopyPageButtonProps {
  pageTitle: string;
  markdownContent?: string;
}

export const DocsCopyPageButton: React.FC<DocsCopyPageButtonProps> = ({
  pageTitle,
  markdownContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<'link' | 'markdown' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const handleCopy = (type: 'link' | 'markdown') => {
    let textToCopy = window.location.href;
    if (type === 'markdown') {
      textToCopy = markdownContent || `# ${pageTitle}\n\nDocumentation source: ${window.location.href}`;
    }

    void copyText(textToCopy).then((ok) => {
      if (!ok) return;
      setCopiedType(type);
      setIsOpen(false);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopiedType(null), 2000);
    });
  };

  return (
    <div className="docs-copy-page-wrapper" ref={menuRef}>
      <button
        type="button"
        className="docs-copy-page-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {copiedType ? (
          <Check size={14} className="text-emerald-400" aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
        <span>{copiedType ? 'Copied' : 'Copy page'}</span>
        <ChevronDown size={12} className={`docs-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="docs-copy-page-menu" role="menu">
          <button
            type="button"
            className="docs-copy-page-menu-item"
            role="menuitem"
            onClick={() => handleCopy('link')}
          >
            <Link2 size={13} aria-hidden="true" />
            <span>Copy page URL</span>
          </button>
          <button
            type="button"
            className="docs-copy-page-menu-item"
            role="menuitem"
            onClick={() => handleCopy('markdown')}
          >
            <FileText size={13} aria-hidden="true" />
            <span>Copy page as Markdown</span>
          </button>
        </div>
      )}
    </div>
  );
};
