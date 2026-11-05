import React, { useState } from 'react';
import { Bot, ShieldCheck, Terminal } from 'lucide-react';
import { Modal } from './ui/Modal';
import { IconTile } from './ui/IconTile';
import { CodeBlock, CopyButton } from './AgentSnippets';
import { useClipboard } from '../hooks/useClipboard';
import { AGENTS, generateAgentMcpConfig, generateAgentSetupCommand, type SupportedAgent } from '../lib/dx';

interface ConnectAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
}

export const ConnectAgentModal: React.FC<ConnectAgentModalProps> = ({ isOpen, onClose, token }) => {
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
      <div className="dlg">
        <div className="dlg-head">
          <IconTile tone="blue"><Bot size={20} /></IconTile>
          <div>
            <h3>Connect AI Agent</h3>
            <p>Give AI agents safe secrets access via MCP without exposing keys in context.</p>
          </div>
        </div>

        <div role="tablist" className="agent-tabs">
          {AGENTS.map((item) => {
            const isSelected = item.id === selectedAgent;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedAgent(item.id)}
                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="agent-meta">
          <div className="agent-meta-row">
            <span>{agent.name} <span className="badge badge-read text-xs ml-1">{agent.badge}</span></span>
            <span className="code-font text-xs text-muted-foreground">{agent.configPath}</span>
          </div>
          <p>{agent.description}</p>
        </div>

        <div className="agent-setup">
          <div>
            <Terminal size={14} />
            <span className="code-font text-xs truncate select-all">{setupCmd}</span>
          </div>
          <CopyButton copied={copiedSetup} label="Copy" copiedLabel="Copied" onClick={() => void copySetup(setupCmd)} title="Copy CLI setup command" />
        </div>

        {activeCliCmd && (
          <CodeBlock title="1-CLICK CLI COMMAND:" code={activeCliCmd} copied={copiedCli} copyLabel="Copy Command" copiedLabel="Copied" onCopy={() => void copyCli(activeCliCmd)} />
        )}

        <CodeBlock config variant="primary" title={`CONFIG FILE CONTENT (${agent.configPath}):`} code={activeSnippet} copied={copiedSnippet} copyLabel="Copy Snippet" copiedLabel="Copied Snippet" onCopy={() => void copySnippet(activeSnippet)} />

        <div className="dlg-note dlg-note-muted">
          <ShieldCheck size={14} />
          <span>VaultKey MCP only exposes tools like <code>run_with_secrets</code> and secret names, never leaking secret values into prompt history.</span>
        </div>

        <div className="agent-custom">
          <details>
            <summary>Customize Token or Server Address</summary>
            <div className="agent-custom-grid">
              <div>
                <label htmlFor="agent-server">Server URL</label>
                <input id="agent-server" type="text" value={customServer} onChange={(e) => setCustomServer(e.target.value)} className="input text-xs w-full" placeholder="http://localhost:8080" />
              </div>
              <div>
                <label htmlFor="agent-token">API Token</label>
                <input id="agent-token" type="text" value={effectiveToken} onChange={(e) => setCustomToken(e.target.value)} className="input text-xs w-full" placeholder="YOUR_VAULTKEY_TOKEN" />
              </div>
            </div>
          </details>
        </div>

        <div className="dlg-actions dlg-actions-end">
          <button onClick={onClose} className="btn btn-secondary btn-sm">Done</button>
        </div>
      </div>
    </Modal>
  );
};
