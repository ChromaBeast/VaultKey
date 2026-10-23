import React, { useState } from 'react';
import { Sparkles, X, Bot, Check, Copy, CornerDownLeft } from 'lucide-react';
import { copyText } from '../../hooks/useClipboard';

interface DocsAskAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QAPreset {
  q: string;
  shortQ: string;
  a: string;
  codeSnippet?: string;
}

const PRESETS: QAPreset[] = [
  {
    q: 'How does run_with_secrets prevent context window leakage?',
    shortQ: 'Zero-leak run_with_secrets',
    a: 'When an AI agent (like Claude Code or Cursor) invokes run_with_secrets, the VaultKey MCP server spawns the requested command in a localized subshell, injecting environment variables directly into that process memory. Only stdout and stderr are returned to the agent—the raw secret values never enter the LLM chat tokens or conversation history.',
    codeSnippet: `// Agent tool call
{
  "tool": "run_with_secrets",
  "arguments": {
    "command": "python manage.py migrate",
    "project": "core",
    "env": "production"
  }
}
// Returns ONLY stdout: "Operations to perform: Apply all migrations... OK"`,
  },
  {
    q: 'How do I add VaultKey MCP to Claude Code or Claude Desktop?',
    shortQ: 'Claude Desktop / Code setup',
    a: 'Add the vaultkey mcp server to your claude_desktop_config.json file with your machine key:',
    codeSnippet: `// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "vaultkey": {
      "command": "vaultkey",
      "args": ["mcp"],
      "env": {
        "VAULTKEY_SERVER": "https://vaultkey.sheershjaiswal.in",
        "VAULTKEY_TOKEN": "vk_your_token_here"
      }
    }
  }
}`,
  },
  {
    q: 'What are VaultKey\'s Argon2id key derivation parameters?',
    shortQ: 'Argon2id parameters',
    a: 'VaultKey uses memory-hard Argon2id configured for high side-channel resistance: Time = 3 iterations, Memory = 64 MB (65,536 KiB), Parallelism = 4 threads, and an individual 32-byte cryptographically random salt per organization. Plaintext keys are wiped from RAM using memory zeroing upon vault lock.',
    codeSnippet: `// In Go backend (internal/crypto/kdf.go):
argon2.IDKey([]byte(passphrase), salt, 3, 64*1024, 4, 32)`,
  },
  {
    q: 'How do I run a command locally with secrets injected?',
    shortQ: 'CLI process injection',
    a: 'Use the vaultkey run command. It reads your encrypted project secrets, decrypts them in RAM, and launches your command with the secrets in process environment variables without creating an on-disk .env file.',
    codeSnippet: `vaultkey run --project=backend --env=staging -- npm run dev`,
  },
];

export const DocsAskAiModal: React.FC<DocsAskAiModalProps> = ({ isOpen, onClose }) => {
  const [selectedQA, setSelectedQA] = useState<QAPreset>(PRESETS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    void copyText(code).then((ok) => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    // Smart matching
    const qLower = customQuestion.toLowerCase();
    const matched = PRESETS.find((p) =>
      p.q.toLowerCase().includes(qLower) ||
      p.shortQ.toLowerCase().includes(qLower) ||
      qLower.split(' ').some((word) => word.length > 3 && p.q.toLowerCase().includes(word))
    );

    if (matched) {
      setSelectedQA(matched);
    } else {
      setSelectedQA({
        q: customQuestion,
        shortQ: 'Custom query',
        a: `VaultKey manages secrets with zero-knowledge AES-256-GCM encryption, an Argon2id key derivation function, an in-memory lock that zeros secrets from RAM, and a full Model Context Protocol (MCP) server for AI coding agents. For "${customQuestion}", refer to our CLI tooling guide (vaultkey run) or MCP agent integration section.`,
        codeSnippet: `vaultkey --help\nvaultkey mcp --help`,
      });
    }
  };

  return (
    <div className="docs-search-backdrop" onClick={onClose}>
      <div
        className="docs-ask-ai-dialog animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ask VaultKey AI"
      >
        <div className="docs-ask-ai-header">
          <div className="docs-ask-ai-brand">
            <div className="docs-ask-ai-icon-bubble">
              <Sparkles size={16} className="text-sky-400" />
            </div>
            <div>
              <h3 className="docs-ask-ai-title">VaultKey Assistant</h3>
              <p className="docs-ask-ai-subtitle">Instant architectural & integration guidance</p>
            </div>
          </div>
          <button type="button" className="docs-ask-ai-close" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>

        <div className="docs-ask-ai-body">
          {/* Quick presets */}
          <div className="docs-ask-ai-chips">
            <span className="docs-ask-ai-chips-label">Quick topics:</span>
            {PRESETS.map((p) => (
              <button
                key={p.shortQ}
                type="button"
                className={`docs-ask-ai-chip ${selectedQA.shortQ === p.shortQ ? 'is-active' : ''}`}
                onClick={() => setSelectedQA(p)}
              >
                {p.shortQ}
              </button>
            ))}
          </div>

          {/* Current Q&A */}
          <div className="docs-ask-ai-card">
            <div className="docs-ask-ai-q">
              <Bot size={15} className="text-sky-400 mt-0.5 flex-shrink-0" />
              <span>{selectedQA.q}</span>
            </div>

            <div className="docs-ask-ai-answer">
              <p>{selectedQA.a}</p>
              {selectedQA.codeSnippet && (
                <div className="docs-ask-ai-code">
                  <div className="docs-ask-ai-code-head">
                    <span>Example</span>
                    <button
                      type="button"
                      className="docs-ask-ai-copy-btn"
                      onClick={() => handleCopy(selectedQA.codeSnippet!)}
                    >
                      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre><code>{selectedQA.codeSnippet}</code></pre>
                </div>
              )}
            </div>
          </div>

          {/* Custom Input */}
          <form className="docs-ask-ai-form" onSubmit={handleAskCustom}>
            <input
              type="text"
              className="docs-ask-ai-input"
              placeholder="Ask anything about MCP, CLI, SDKs, or zero-leak encryption..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
            />
            <button type="submit" className="docs-ask-ai-submit" disabled={!customQuestion.trim()}>
              <CornerDownLeft size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
