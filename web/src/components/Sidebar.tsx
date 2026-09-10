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
        width: '224px',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px',
        margin: '16px',
        padding: '16px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
        flexShrink: 0,
        background: 'var(--vk-surface-1)',
        border: '1px solid var(--vk-border)',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 8px 14px',
            borderBottom: '1px solid var(--vk-border)',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, rgba(115, 230, 255, 0.2) 0%, rgba(139, 124, 255, 0.2) 100%)',
              border: '1px solid rgba(115, 230, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <KeyRound size={14} color="var(--vk-accent)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className="brand-text"
                style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--vk-text)', letterSpacing: '-0.02em' }}
              >
                VaultKey
              </span>
              {org?.plan === 'pro' && (
                <span
                  className="code-font"
                  style={{
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    background: 'var(--vk-accent-dim)',
                    color: 'var(--vk-accent)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    border: '1px solid rgba(115, 230, 255, 0.3)',
                  }}
                >
                  PRO
                </span>
              )}
            </div>
            {org && (
              <div style={{ fontSize: '0.72rem', color: 'var(--vk-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {org.name}
              </div>
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
              color: 'var(--vk-text-muted)',
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
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--vk-surface-2)' : 'transparent',
                color: isActive ? 'var(--vk-text)' : 'var(--vk-text-secondary)',
                borderLeft: isActive ? '2px solid var(--vk-accent)' : '2px solid transparent',
                borderTop: '1px solid transparent',
                borderRight: '1px solid transparent',
                borderBottom: '1px solid transparent',
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
