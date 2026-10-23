import React from 'react';
import { LogOut } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface SidebarAccountControlsProps {
  email: string;
  role: string;
  onRequestLogout: () => void;
}

export const SidebarAccountControls: React.FC<SidebarAccountControlsProps> = ({
  email,
  role,
  onRequestLogout,
}) => {
  const { open } = useSidebar();
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="sidebar-account-controls shrink-0 border-t border-border/50 pt-3">
      <div className="flex min-w-0 items-center gap-2.5 px-2 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary font-mono text-xs font-bold text-foreground">
          {initials}
        </div>
        {open && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-medium text-foreground" title={email}>
              {email}
            </span>
            <span className="text-xs capitalize text-muted-foreground">{role} role</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onRequestLogout}
        title={!open ? 'Log out' : undefined}
        aria-label="Log out"
        className="sidebar-footer-action sidebar-footer-action-danger"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {open && <span className="text-xs font-medium">Log out</span>}
      </button>
    </div>
  );
};

export default SidebarAccountControls;
