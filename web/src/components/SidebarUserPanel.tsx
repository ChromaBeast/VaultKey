import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pushToast } from '../lib/toast';

export const SidebarUserPanel: React.FC = () => {
  const { user, lockVault } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLock = async () => {
    try {
      await lockVault();
      pushToast('Vault locked & memory wiped', 'info');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div style={{ paddingTop: '12px', borderTop: '1px solid var(--vk-border)' }}>
      <div
        style={{
          padding: '4px 6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--vk-surface-2)',
            border: '1px solid var(--vk-border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--vk-text)',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: '0.725rem',
            flexShrink: 0,
          }}
        >
          {user.email.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--vk-text)',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            title={user.email}
          >
            {user.email}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--vk-text-muted)', textTransform: 'capitalize' }}>
            {user.role} role
          </div>
        </div>
      </div>
      <button
        onClick={() => void handleLock()}
        className="btn btn-secondary"
        style={{
          width: '100%',
          justifyContent: 'space-between',
          fontSize: '0.775rem',
          padding: '7px 10px',
          color: 'var(--vk-danger)',
          borderColor: 'rgba(255, 107, 122, 0.2)',
        }}
        title="Zero memory & lock vault immediately"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={13} /> Lock Vault
        </span>
        <kbd style={{ fontSize: '0.65rem', opacity: 0.7, fontFamily: 'monospace' }}>⌘K</kbd>
      </button>
    </div>
  );
};
