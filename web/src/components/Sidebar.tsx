import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, org, lockVault } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/secrets', label: 'Secrets', icon: '🔑' },
    { path: '/keys', label: 'API Keys', icon: '⚡' },
    { path: '/audit', label: 'Audit Log', icon: '🛡️' },
    { path: '/billing', label: 'Billing & Plans', icon: '✨' },
    { path: '/docs', label: 'Docs', icon: '📚' },
  ];

  const handleLock = async () => {
    await lockVault();
    navigate('/login');
  };

  return (
    <aside
      className="glass"
      style={{
        width: '250px',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px',
        margin: '16px',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '16px',
        flexShrink: 0,
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            🗝️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="brand-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                VaultKey
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                PRO
              </span>
            </div>
            {org && <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{org.name}</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `btn ${isActive ? 'active-nav' : ''}`}
              style={({ isActive }) => ({
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: '1px solid ' + (isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent'),
                justifyContent: 'flex-start',
                width: '100%',
              })}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Profile Footer */}
      {user && (
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '6px 8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontWeight: 700, fontSize: '0.8rem' }}>
              {user.email.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                {user.role} Role
              </div>
            </div>
          </div>
          <button onClick={handleLock} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
            🔒 Lock Vault
          </button>
        </div>
      )}
    </aside>
  );
};
