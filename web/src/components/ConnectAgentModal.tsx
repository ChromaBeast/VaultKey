import React, { useState } from 'react';
import { Bot, Check, Copy, Terminal, ShieldCheck } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useClipboard } from '../hooks/useClipboard';
import { AGENTS, generateAgentMcpConfig, generateAgentSetupCommand, type SupportedAgent } from '../lib/dx';

interface ConnectAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
}

export const ConnectAgentModal: React.FC<ConnectAgentModalProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<SupportedAgent>('claude');
  const [customServer, setCustomServer] = useState(() =>
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:8080'
  );
  const [customToken, setCustomToken] = useState<string | null>(null);
  const [prevTokenProp, setPrevTokenProp] = useState(token);
  const { copied: copiedSnippet, copy: copySnippet } = useClipboard();
  const { copied: copiedCli, copy: copyCli } = useClipboard();
  const { copied: copiedSetup, copy: copySetup } = useClipboard();

  // Reset custom token when token prop updates (e.g., new token created)
  if (token !== prevTokenProp) {
    setPrevTokenProp(token);
    setCustomToken(null);
  }

  if (!isOpen) return null;

  const effectiveToken = customToken !== null ? customToken : (token || '');
  const currentToken = effectiveToken.trim() || 'YOUR_VAULTKEY_TOKEN';
  const currentServer = customServer.trim() || 'http://localhost:8080';
  const agent = AGENTS.find((a) => a.id === selectedAgent) || AGENTS[0];

  const activeSnippet = generateAgentMcpConfig(agent.format, currentServer, currentToken);
  const activeCliCmd = agent.cliCommand ? agent.cliCommand(currentServer, currentToken) : null;
  const setupCmd = generateAgentSetupCommand(agent.id, currentServer, currentToken);

  return (
    <Modal label="Connect AI Agent" isOpen={isOpen} onClose={onClose} width={580}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(52, 211, 153, 0.1)',
              color: 'var(--vk-success, #34d399)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--vk-text, #fff)', margin: 0 }}>
              Connect AI Agent
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--vk-text-muted, #94a3b8)', margin: '2px 0 0 0' }}>
              Give AI agents safe secrets access via MCP without exposing keys in context.
            </p>
          </div>
        </div>

        {/* Agent Selector Tabs */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            padding: '12px 0 16px 0',
            borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          }}
        >
          {AGENTS.map((item) => {
            const isSelected = item.id === selectedAgent;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedAgent(item.id)}
                className={`btn text-xs px-3 py-1.5 ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Selected Agent Meta */}
        <div style={{ marginTop: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vk-text, #fff)' }}>
              {agent.name} <span className="badge badge-read text-xs ml-1">{agent.badge}</span>
            </span>
            <span className="code-font text-xs text-muted-foreground">{agent.configPath}</span>
          </div>
          <p style={{ fontSize: '0.785rem', color: 'var(--vk-text-muted, #94a3b8)', margin: 0 }}>
            {agent.description}
          </p>
        </div>

        {/* Quick CLI Setup Option */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
            borderRadius: '6px',
            padding: '10px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} className="text-primary shrink-0" />
            <span className="code-font text-xs truncate select-all">{setupCmd}</span>
          </div>
          <button
            type="button"
            onClick={() => void copySetup(setupCmd)}
            className="btn btn-secondary text-xs px-2.5 py-1 shrink-0"
            title="Copy CLI setup command"
          >
            {copiedSetup ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedSetup ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Claude Code CLI Command if available */}
        {activeCliCmd && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vk-text-muted, #94a3b8)' }}>
                1-CLICK CLI COMMAND:
              </span>
              <button
                type="button"
                onClick={() => void copyCli(activeCliCmd)}
                className="btn btn-secondary text-xs px-2 py-0.5"
                style={{ fontSize: '0.725rem' }}
              >
                {copiedCli ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copiedCli ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <pre
              className="code-font"
              style={{
                background: 'var(--vk-bg, #090d16)',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                fontSize: '0.75rem',
                color: 'var(--vk-text, #f8fafc)',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {activeCliCmd}
            </pre>
          </div>
        )}

        {/* Configuration snippet */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vk-text-muted, #94a3b8)' }}>
              CONFIG FILE CONTENT ({agent.configPath}):
            </span>
            <button
              type="button"
              onClick={() => void copySnippet(activeSnippet)}
              className="btn btn-primary text-xs px-2.5 py-1"
              style={{ fontSize: '0.75rem' }}
            >
              {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedSnippet ? 'Copied Snippet' : 'Copy Snippet'}</span>
            </button>
          </div>
          <pre
            className="code-font"
            style={{
              background: 'var(--vk-bg, #090d16)',
              padding: '12px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
              fontSize: '0.75rem',
              lineHeight: 1.45,
              color: 'var(--vk-success, #34d399)',
              maxHeight: '160px',
              overflowY: 'auto',
              margin: 0,
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            {activeSnippet}
          </pre>
        </div>

        {/* Security badge note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            fontSize: '0.725rem',
            color: 'var(--vk-text-muted, #94a3b8)',
          }}
        >
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span>
            VaultKey MCP only exposes tools like <code>run_with_secrets</code> and secret names, never leaking secret values into prompt history.
          </span>
        </div>

        {/* Optional token/server customization */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border, rgba(255,255,255,0.06))' }}>
          <details style={{ fontSize: '0.75rem', color: 'var(--vk-text-muted)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 500, marginBottom: '8px' }}>
              Customize Token or Server Address
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Server URL</label>
                <input
                  type="text"
                  value={customServer}
                  onChange={(e) => setCustomServer(e.target.value)}
                  className="input text-xs w-full"
                  placeholder="http://localhost:8080"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">API Token</label>
                <input
                  type="text"
                  value={effectiveToken}
                  onChange={(e) => setCustomToken(e.target.value)}
                  className="input text-xs w-full"
                  placeholder="YOUR_VAULTKEY_TOKEN"
                />
              </div>
            </div>
          </details>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={onClose} className="btn btn-secondary text-xs px-4 py-1.5">
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
