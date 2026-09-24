import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, KeyRound, Lock, ScrollText, Settings } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '../context/AuthContext';
import { pushToast } from '../lib/toast';
import { ConfirmDialog } from './ConfirmDialog';
import { SidebarAccountControls } from './SidebarAccountControls';

const PRIMARY_NAV_ITEMS = [
  { path: '/secrets', label: 'Secrets', icon: Lock },
  { path: '/keys', label: 'API Keys', icon: KeyRound },
  { path: '/audit', label: 'Audit Ledger', icon: ScrollText },
];

const WORKSPACE_NAV_ITEMS = [
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

type Theme = 'dark' | 'light';

interface AppSidebarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ theme, onToggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { org, user, logout } = useAuth();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      pushToast('Vault locked and signed out', 'info');
      navigate('/login', { replace: true });
    } catch {
      pushToast('Could not clear the session. Please try again.', 'error');
    } finally {
      setLogoutLoading(false);
      setLogoutOpen(false);
    }
  };

  const renderLinks = (items: typeof PRIMARY_NAV_ITEMS) => items.map((item) => {
    const Icon = item.icon;
    return (
      <SidebarLink
        key={item.path}
        link={{
          label: item.label,
          href: item.path,
          icon: <Icon className="h-4 w-4 shrink-0" />,
          isActive: location.pathname === item.path,
          onClick: (event) => {
            event.preventDefault();
            navigate(item.path);
            if (window.innerWidth < 768) setOpen(false);
          },
        }}
      />
    );
  });

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody>
        <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <SidebarHeader org={org} />
          <nav className="mt-5 flex flex-col gap-1" aria-label="Primary">
            {renderLinks(PRIMARY_NAV_ITEMS)}
          </nav>

          <div className="mt-auto border-t border-border/50 pt-4">
            {open && (
              <div className="px-2.5 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Workspace
              </div>
            )}
            <nav className="flex flex-col gap-1" aria-label="Workspace management">
              {renderLinks(WORKSPACE_NAV_ITEMS)}
            </nav>
          </div>
        </div>

        {user && (
          <SidebarAccountControls
            email={user.email}
            role={user.role}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onRequestLogout={() => setLogoutOpen(true)}
          />
        )}
      </SidebarBody>

      <ConfirmDialog
        isOpen={logoutOpen}
        title="Log out and lock the vault?"
        message="This will lock your vault and clear this browser session."
        confirmLabel="Log out"
        danger
        loading={logoutLoading}
        onConfirm={() => void handleLogout()}
        onClose={() => setLogoutOpen(false)}
      />
    </Sidebar>
  );
};

const SidebarHeader: React.FC<{ org: { plan?: string; name: string } | null }> = ({ org }) => {
  const { open } = useSidebar();
  return (
    <div className="flex items-center gap-3 border-b border-border/50 px-1 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
        <img src="/vaultkey-logo.png" alt="" className="h-6 w-6 object-contain" />
      </div>
      {open && (
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-foreground">VaultKey</span>
            {org?.plan === 'pro' && (
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Pro</span>
            )}
          </div>
          {org && <span className="truncate text-xs text-muted-foreground">{org.name}</span>}
        </div>
      )}
    </div>
  );
};

export { AppSidebar as Sidebar };
export default AppSidebar;
