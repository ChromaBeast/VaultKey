import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SidebarUserPanel: React.FC = () => {
  const { user, lockVault } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLock = async () => {
    await lockVault();
    navigate('/login');
  };

  return (
    <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div
        style={{
          padding: '6px 8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
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
              color: '#f8fafc',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {user.email}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'capitalize' }}>
            {user.role}
          </div>
        </div>
      </div>
      <button
        onClick={() => void handleLock()}
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}
      >
        <LogOut size={14} /> Lock Vault
      </button>
    </div>
  );
};
