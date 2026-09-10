import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  KeyRound,
  Lock,
  Plus,
  ScrollText,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './ui/Modal';
import type { LucideIcon } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateSecret?: () => void;
}

interface PaletteAction {
  id: string;
  icon: LucideIcon;
  label: string;
  category: 'ACTIONS' | 'NAVIGATION' | 'SECURITY';
  run: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateSecret,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { lockVault } = useAuth();

  const actions: PaletteAction[] = [
    { id: 'create-secret', icon: Plus, label: 'Create New Secret', category: 'ACTIONS', run: () => { onClose(); onOpenCreateSecret?.(); } },
    { id: 'nav-secrets', icon: Lock, label: 'Secrets Vault', category: 'NAVIGATION', run: () => { navigate('/secrets'); onClose(); } },
    { id: 'nav-keys', icon: KeyRound, label: 'API Access Keys', category: 'NAVIGATION', run: () => { navigate('/keys'); onClose(); } },
    { id: 'nav-audit', icon: ScrollText, label: 'Audit Ledger', category: 'NAVIGATION', run: () => { navigate('/audit'); onClose(); } },
    { id: 'nav-billing', icon: CreditCard, label: 'Billing & Subscriptions', category: 'NAVIGATION', run: () => { navigate('/billing'); onClose(); } },
    { id: 'nav-settings', icon: Lock, label: 'Settings & Team Access', category: 'NAVIGATION', run: () => { navigate('/settings'); onClose(); } },
    { id: 'nav-docs', icon: BookOpen, label: 'Documentation & API Reference', category: 'NAVIGATION', run: () => { navigate('/docs'); onClose(); } },
    { id: 'lock-vault', icon: ShieldAlert, label: 'Zero Memory & Lock Vault Immediately', category: 'SECURITY', run: async () => { onClose(); await lockVault(); navigate('/login'); } },
  ];

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const clamped = Math.min(activeIndex, Math.max(0, filtered.length - 1));

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(Math.min(clamped + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(Math.max(clamped - 1, 0));
        break;
      case 'Enter': {
        e.preventDefault();
        const item = filtered[clamped];
        if (item) item.run();
        break;
      }
      default:
        break;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={560} align="top">
      <div style={{ padding: '14px' }}>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            autoFocus
            className="input"
            placeholder="Type a command or search... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            role="combobox"
            aria-expanded={filtered.length > 0}
            aria-controls="command-palette-listbox"
            aria-activedescendant={filtered[clamped] ? `cmd-opt-${clamped}` : undefined}
            aria-label="Search commands"
            style={{ fontSize: '0.95rem', padding: '10px 14px', background: 'var(--vk-surface-2)', border: '1px solid var(--vk-border)' }}
          />
        </div>

        <ul role="listbox" id="command-palette-listbox" aria-label="Commands" style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {filtered.map((item, i) => {
            const Icon = item.icon;
            const isDanger = item.category === 'SECURITY';
            return (
              <li
                key={item.id}
                id={`cmd-opt-${i}`}
                role="option"
                aria-selected={i === clamped}
                className={`cmd-item${i === clamped ? ' cmd-item-active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => item.run()}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={15} color={isDanger ? 'var(--vk-danger)' : 'var(--vk-accent)'} />
                  <span style={{ color: isDanger ? 'var(--vk-danger)' : 'var(--vk-text)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {item.label}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: 'var(--vk-text-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.category}
                </span>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li style={{ textAlign: 'center', padding: '24px', color: 'var(--vk-text-muted)', fontSize: '0.85rem', listStyle: 'none' }}>
              No commands matching "{query}"
            </li>
          )}
        </ul>

        <div
          style={{
            borderTop: '1px solid var(--vk-border)',
            paddingTop: '8px',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--vk-text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <span>↑ ↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </Modal>
  );
};
