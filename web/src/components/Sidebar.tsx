import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/secrets', label: 'Secrets',      tag: 'SEC' },
  { path: '/keys',    label: 'API Keys',     tag: 'KEY' },
  { path: '/audit',   label: 'Audit Ledger', tag: 'LOG' },
  { path: '/billing', label: 'Billing',      tag: 'BILL' },
  { path: '/docs',    label: 'Docs',         tag: 'DOC' },
];

export const Sidebar: React.FC = () => {
  const { user, org, lockVault } = useAuth();
  const navigate = useNavigate();

  const handleLock = async () => {
    await lockVault();
    navigate('/login');
  };

  return (
    <aside
      className="glass"
      style={{
        width: '220px',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px',
        margin: '16px',
        padding: '18px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '16px',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 8px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              boxShadow: '0 4px 10px rgba(99, 102, 246, 0.35)',
              flexShrink: 0,
            }}
          >
            🗝️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="brand-text"
                style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}
              >
                VaultKey
              </span>
              {org?.plan === 'pro' && (
                <span
                  className="code-font"
                  style={{
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    background: 'rgba(99, 102, 241, 0.18)',
                    color: '#818cf8',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  PRO
                </span>
              )}
            </div>
            {org && (
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                {org.name}
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                color: isActive ? '#f8fafc' : '#94a3b8',
                border: `1px solid ${isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}`,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <span
                className="code-font"
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'inherit',
                  opacity: 0.6,
                  minWidth: '28px',
                }}
              >
                {item.tag}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User footer */}
      {user && (
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
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'capitalize' }}>
                {user.role}
              </div>
            </div>
          </div>
          <button
            onClick={handleLock}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}
          >
            Lock Vault
          </button>
        </div>
      )}
    </aside>
  );
};
