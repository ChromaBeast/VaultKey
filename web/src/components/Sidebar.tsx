import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  KeyRound,
  Lock,
  ScrollText,
  Settings,
} from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '../context/AuthContext';
import { pushToast } from '../lib/toast';

const NAV_ITEMS = [
  { path: '/secrets', label: 'Secrets', icon: Lock },
  { path: '/keys', label: 'API Keys', icon: KeyRound },
  { path: '/audit', label: 'Audit Ledger', icon: ScrollText },
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/docs', label: 'Docs', icon: BookOpen },
];

export const AppSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { org, user, lockVault } = useAuth();

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
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <SidebarHeader org={org} />
          <nav className="mt-6 flex flex-col gap-1" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <SidebarLink
                  key={item.path}
                  link={{
                    label: item.label,
                    href: item.path,
                    icon: <Icon className="h-4 w-4 shrink-0" />,
                    isActive,
                    onClick: (e) => {
                      e.preventDefault();
                      navigate(item.path);
                    },
                  }}
                />
              );
            })}
          </nav>
        </div>

        {user && (
          <SidebarFooter
            email={user.email}
            role={user.role}
            onLock={() => void handleLock()}
          />
        )}
      </SidebarBody>
    </Sidebar>
  );
};

const SidebarHeader: React.FC<{ org: { plan?: string; name: string } | null }> = ({ org }) => {
  const { open } = useSidebar();
  return (
    <div className="flex items-center gap-3 py-2 px-1 border-b border-border/50">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
        <KeyRound className="h-4 w-4 text-primary" />
      </div>
      {open && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-sm tracking-tight">VaultKey</span>
            {org?.plan === 'pro' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                PRO
              </span>
            )}
          </div>
          {org && (
            <span className="text-xs text-muted-foreground truncate">{org.name}</span>
          )}
        </div>
      )}
    </div>
  );
};

const SidebarFooter: React.FC<{
  email: string;
  role: string;
  onLock: () => void;
}> = ({ email, role, onLock }) => {
  const { open } = useSidebar();
  const initials = email.substring(0, 2).toUpperCase();

  return (
    <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
      <div className="flex items-center gap-2.5 px-1">
        <div className="h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0">
          {initials}
        </div>
        {open && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-foreground truncate" title={email}>
              {email}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">{role} role</span>
          </div>
        )}
      </div>

      {open && (
        <button
          onClick={onLock}
          type="button"
          className="w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors"
          title="Zero memory & lock vault immediately"
        >
          <span className="flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> Lock Vault
          </span>
          <kbd className="text-[10px] opacity-70 font-mono">⌘K</kbd>
        </button>
      )}
    </div>
  );
};

export { AppSidebar as Sidebar };
export default AppSidebar;
