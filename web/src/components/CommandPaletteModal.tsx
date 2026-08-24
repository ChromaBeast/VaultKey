import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  Database,
  KeyRound,
  Lock,
  ScrollText,
  Zap,
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
  category: string;
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
    { id: 'create-secret', icon: Zap, label: 'Create New Secret', category: 'Actions', run: () => { onClose(); onOpenCreateSecret?.(); } },
    { id: 'nav-secrets', icon: Database, label: 'Go to Secrets Vault', category: 'Navigation', run: () => { navigate('/secrets'); onClose(); } },
    { id: 'nav-keys', icon: KeyRound, label: 'Go to API Access Keys', category: 'Navigation', run: () => { navigate('/keys'); onClose(); } },
    { id: 'nav-audit', icon: ScrollText, label: 'Go to Audit Ledger', category: 'Navigation', run: () => { navigate('/audit'); onClose(); } },
    { id: 'nav-billing', icon: CreditCard, label: 'Go to Billing & Subscriptions', category: 'Navigation', run: () => { navigate('/billing'); onClose(); } },
    { id: 'nav-settings', icon: Lock, label: 'Go to Settings & Team', category: 'Navigation', run: () => { navigate('/settings'); onClose(); } },
    { id: 'nav-docs', icon: BookOpen, label: 'Open Documentation & API Reference', category: 'Navigation', run: () => { navigate('/docs'); onClose(); } },
    { id: 'lock-vault', icon: Lock, label: 'Zero Memory & Lock Vault Immediately', category: 'Security', run: async () => { onClose(); await lockVault(); navigate('/login'); } },
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
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(Math.max(0, filtered.length - 1));
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
    <Modal isOpen={isOpen} onClose={onClose} width={600} align="top">
      <div style={{ padding: '16px' }}>
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
          style={{ fontSize: '1rem', padding: '12px 16px', background: '#0d121f', marginBottom: '12px' }}
        />

        <ul role="listbox" id="command-palette-listbox" aria-label="Commands" style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {filtered.map((item, i) => {
            const Icon = item.icon;
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={16} color="#818cf8" />
                  <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                </span>
                <span className="badge badge-read" style={{ fontSize: '0.65rem' }}>
                  {item.category}
                </span>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.875rem', listStyle: 'none' }}>
              No matching actions found for "{query}"
            </li>
          )}
        </ul>
      </div>
    </Modal>
  );
};
