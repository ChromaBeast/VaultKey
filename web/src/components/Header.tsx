import React from 'react';
import type { Org, User } from '../lib/api';

interface HeaderProps {
  user: User | null;
  org: Org | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLock: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  org,
  activeTab,
  setActiveTab,
  onLock,
  onLogout,
}) => {
  const tabs = [
    ...(user
      ? [
          { id: 'secrets', label: '🔑 Secrets' },
          { id: 'keys', label: '⚡ API Keys' },
          { id: 'audit', label: '🛡️ Audit Log' },
          { id: 'billing', label: '✨ Billing & Plans' },
        ]
      : []),
    { id: 'docs', label: '📚 Docs' },
  ];

  return (
    <header
      className="glass"
      style={{
        margin: '16px auto',
        maxWidth: '1200px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px',
        position: 'sticky',
        top: '16px',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => setActiveTab(user ? 'secrets' : 'docs')}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            }}
          >
            🗝️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                VaultKey
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                PRO
              </span>
            </div>
            {org && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '1px',
                }}
              >
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{org.name}</span>
                <span
                  style={{
                    background:
                      org.plan === 'pro' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.08)',
                    color: org.plan === 'pro' ? '#c084fc' : '#94a3b8',
                    border: '1px solid ' + (org.plan === 'pro' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255,255,255,0.12)'),
                    padding: '1px 8px',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {org.plan} Plan
                </span>
              </div>
            )}
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: '1px solid ' + (isActive ? 'rgba(168, 85, 247, 0.4)' : 'transparent'),
                  boxShadow: isActive ? '0 4px 12px rgba(168, 85, 247, 0.15)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onLock}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.825rem' }}
            title="Zero RAM Key & Lock Vault"
          >
            🔒 Lock Vault
          </button>
          <button
            onClick={onLogout}
            className="btn btn-danger"
            style={{ padding: '8px 14px', fontSize: '0.825rem' }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};
