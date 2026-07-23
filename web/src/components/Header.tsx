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
    ...(user ? [
      { id: 'secrets', label: 'Secrets' },
      { id: 'keys', label: 'API Keys' },
      { id: 'audit', label: 'Audit Log' },
      { id: 'billing', label: 'Billing & Plans ✨' },
    ] : []),
    { id: 'docs', label: '📚 Documentation' },
  ];

  return (
    <header className="glass" style={{ margin: '16px auto', maxWidth: '1200px', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab(user ? 'secrets' : 'docs')}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}>
            🗝️
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VaultKey <span style={{ fontSize: '0.65rem', background: '#6366f1', color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', verticalAlign: 'middle' }}>SaaS</span>
            </span>
            {org && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{org.name}</span>
                <span style={{ background: org.plan === 'pro' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.08)', color: org.plan === 'pro' ? '#c084fc' : '#94a3b8', padding: '1px 6px', borderRadius: '999px', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  {org.plan} Plan
                </span>
              </div>
            )}
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '6px', marginLeft: '24px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                border: '1px solid ' + (activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent'),
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onLock} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '0.8rem' }} title="Zero RAM Key & Lock Vault">
            🔒 Lock Vault
          </button>
          <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '0.8rem', color: '#f87171' }}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};
