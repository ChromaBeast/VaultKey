import React from 'react';
import { Check, Copy } from 'lucide-react';

interface DocsCodeBlockProps {
  id: string;
  language: string;
  code: string;
  copiedSnippet: string | null;
  onCopy: (id: string, code: string) => void;
}

export const DocsCodeBlock: React.FC<DocsCodeBlockProps> = ({
  id,
  language,
  code,
  copiedSnippet,
  onCopy,
}) => {
  const copied = copiedSnippet === id;

  return (
    <div className="docs-code-window">
      <div className="docs-code-toolbar">
        <span className="docs-code-language">{language}</span>
        <button
          type="button"
          className="docs-copy-button"
          onClick={() => onCopy(id, code)}
          aria-label={`Copy ${language} example`}
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-font" tabIndex={0}><code>{code}</code></pre>
    </div>
  );
};
