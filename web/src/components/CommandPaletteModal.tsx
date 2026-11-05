import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  KeyRound,
  Lock,
  Plus,
  ScrollText,
  ShieldAlert,
} from 'lucide-react';
import { CREATE_SECRET_EVENT } from '../lib/events';
import { canWriteSecrets, isAdminRole } from '../lib/permissions';
import { useAuth } from '../context/AuthContext';
import { Modal } from './ui/Modal';
import { Input, Kbd } from './ui';
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
  const location = useLocation();
  const { lockVault, user } = useAuth();

  const actions: PaletteAction[] = [
    { id: 'create-secret', icon: Plus, label: 'Create New Secret', category: 'ACTIONS', run: () => { onClose(); if (onOpenCreateSecret) onOpenCreateSecret(); else if (location.pathname === '/secrets') window.dispatchEvent(new CustomEvent(CREATE_SECRET_EVENT)); else navigate('/secrets', { state: { createSecret: true } }); } },
    { id: 'nav-secrets', icon: Lock, label: 'Secrets Vault', category: 'NAVIGATION', run: () => { navigate('/secrets'); onClose(); } },
    { id: 'nav-keys', icon: KeyRound, label: 'API Access Keys', category: 'NAVIGATION', run: () => { navigate('/keys'); onClose(); } },
    { id: 'nav-audit', icon: ScrollText, label: 'Audit Ledger', category: 'NAVIGATION', run: () => { navigate('/audit'); onClose(); } },
    { id: 'nav-billing', icon: CreditCard, label: 'Billing & Subscriptions', category: 'NAVIGATION', run: () => { navigate('/billing'); onClose(); } },
    { id: 'nav-settings', icon: Lock, label: 'Settings & Team Access', category: 'NAVIGATION', run: () => { navigate('/settings'); onClose(); } },
    { id: 'nav-docs', icon: BookOpen, label: 'Documentation & API Reference', category: 'NAVIGATION', run: () => { navigate('/docs'); onClose(); } },
    { id: 'lock-vault', icon: ShieldAlert, label: 'Log out', category: 'SECURITY', run: async () => { onClose(); await lockVault(); navigate('/login'); } },
  ];

  const available = actions.filter((action) => action.id !== "create-secret" || canWriteSecrets(user?.role))
    .filter((action) => !["nav-keys", "nav-audit"].includes(action.id) || isAdminRole(user?.role));
  const filtered = available.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const clamped = Math.min(activeIndex, Math.max(0, filtered.length - 1));

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(Math.max(0, Math.min(clamped + 1, filtered.length - 1)));
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
    <Modal label="Commands" isOpen={isOpen} onClose={onClose} width={560} align="top">
      <div className="palette">
        <div className="palette-search">
          <Input
            autoFocus
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
          />
        </div>

        <ul role="listbox" id="command-palette-listbox" aria-label="Commands" className="palette-list">
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
                <span className="palette-item">
                  <Icon size={15} color={isDanger ? 'var(--vk-danger)' : 'var(--vk-accent)'} />
                  <span className={`palette-label${isDanger ? ' is-danger' : ''}`}>
                    {item.label}
                  </span>
                </span>
                <span className="palette-cat">
                  {item.category}
                </span>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="palette-empty">
              No commands matching "{query}"
            </li>
          )}
        </ul>

        <div className="palette-foot">
          <span className="palette-hint">
            <Kbd>↑</Kbd><Kbd>↓</Kbd> navigate
          </span>
          <span className="palette-hint">
            <Kbd>↵</Kbd> select
          </span>
          <span className="palette-hint">
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </div>
    </Modal>
  );
};
