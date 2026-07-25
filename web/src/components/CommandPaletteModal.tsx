import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateSecret?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateSecret,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { lockVault } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuery('');
        if (isOpen) onClose();
        else {
          // Open triggered from parent or global handler
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'create-secret', icon: '⚡', label: 'Create New Secret', category: 'Actions', action: () => { onClose(); if (onOpenCreateSecret) onOpenCreateSecret(); } },
    { id: 'nav-secrets', icon: '🔑', label: 'Go to Secrets Vault', category: 'Navigation', action: () => { navigate('/secrets'); onClose(); } },
    { id: 'nav-keys', icon: '🗝️', label: 'Go to API Access Keys', category: 'Navigation', action: () => { navigate('/keys'); onClose(); } },
    { id: 'nav-audit', icon: '🛡️', label: 'Go to Audit Ledger', category: 'Navigation', action: () => { navigate('/audit'); onClose(); } },
    { id: 'nav-billing', icon: '✨', label: 'Go to Billing & Subscriptions', category: 'Navigation', action: () => { navigate('/billing'); onClose(); } },
    { id: 'nav-docs', icon: '📚', label: 'Open Documentation & API Reference', category: 'Navigation', action: () => { navigate('/docs'); onClose(); } },
    { id: 'lock-vault', icon: '🔒', label: 'Zero Memory & Lock Vault Immediately', category: 'Security', action: async () => { onClose(); await lockVault(); navigate('/login'); } },
  ];

  const filtered = actions.filter(
    (a) => a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={onClose}
    >
      <div
        className="glass-glow"
        style={{ width: '100%', maxWidth: '600px', padding: '16px', borderRadius: '16px', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            autoFocus
            className="input"
            placeholder="Type a command or search... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ fontSize: '1rem', padding: '12px 16px', background: '#0d121f' }}
          />
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '4px',
                background: 'rgba(255, 255, 255, 0.03)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
              </div>
              <span className="badge badge-read" style={{ fontSize: '0.65rem' }}>
                {item.category}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.875rem' }}>
              No matching actions found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
