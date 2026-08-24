import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  KeyRound,
  Lock,
  ScrollText,
  Settings,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SidebarUserPanel } from './SidebarUserPanel';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/secrets', label: 'Secrets', icon: Lock },
  { path: '/keys', label: 'API Keys', icon: KeyRound },
  { path: '/audit', label: 'Audit Ledger', icon: ScrollText },
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/docs', label: 'Docs', icon: BookOpen },
];

export const Sidebar: React.FC<{ mobileOpen: boolean; onMobileClose: () => void }> = ({
  mobileOpen,
  onMobileClose,
}) => {
  const { org } = useAuth();

  return (
    <aside
      className="glass app-sidebar"
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
              boxShadow: '0 4px 10px rgba(99, 102, 246, 0.35)',
              flexShrink: 0,
            }}
          >
            <KeyRound size={15} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
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
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                {org.name}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onMobileClose}
            className="app-sidebar-close"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: mobileOpen ? 'inline-flex' : 'none',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
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
              })}
            >
              <item.icon size={15} style={{ opacity: 0.85, minWidth: '18px' }} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <SidebarUserPanel />
    </aside>
  );
};
