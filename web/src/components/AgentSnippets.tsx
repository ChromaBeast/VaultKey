import React from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  copied: boolean;
  label: string;
  copiedLabel: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  title?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ copied, label, copiedLabel, onClick, variant = 'secondary', title }) => (
  <button type="button" onClick={onClick} title={title} className={`btn btn-sm btn-${variant} shrink-0`}>
    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    <span>{copied ? copiedLabel : label}</span>
  </button>
);

interface CodeBlockProps {
  title: string;
  code: string;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
  onCopy: () => void;
  variant?: 'primary' | 'secondary';
  config?: boolean;
}

/** Labelled code block with its own copy button, used for the CLI command and the MCP config file. */
export const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, copied, copyLabel, copiedLabel, onCopy, variant = 'secondary', config }) => (
  <div className={config ? undefined : 'agent-block'}>
    <div className="agent-label-row">
      <span className="agent-label">{title}</span>
      <CopyButton copied={copied} label={copyLabel} copiedLabel={copiedLabel} onClick={onCopy} variant={variant} />
    </div>
    <pre className={`code-font agent-code${config ? ' agent-code-config' : ''}`}>{code}</pre>
  </div>
);
