import React, { createContext, useContext, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';

export interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isActive?: boolean;
}
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
  return context;
};
export const SidebarProvider = ({ children, open: controlledOpen, setOpen: controlledSetOpen, animate = true }: {
  children: React.ReactNode; open?: boolean; setOpen?: React.Dispatch<React.SetStateAction<boolean>>; animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  return <SidebarContext.Provider value={{ open: controlledOpen ?? openState, setOpen: controlledSetOpen ?? setOpenState, animate }}>{children}</SidebarContext.Provider>;
};
export const Sidebar = SidebarProvider;
export const SidebarBody = (props: React.ComponentProps<'div'>) => {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile ? <MobileSidebar {...props} /> : <DesktopSidebar {...props} />;
};
export const DesktopSidebar = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { open, animate } = useSidebar();
  return <div className={cn('app-desktop-sidebar px-3 py-4 flex flex-col bg-card text-card-foreground border-r border-border shrink-0', className)}
    style={{ width: !animate || open ? 240 : 64 }} {...props}>{children}</div>;
};
export const MobileSidebar = ({ children }: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();
  return <div className="h-14 px-4 flex items-center justify-between bg-card border-b border-border w-full">
    <Link to="/secrets" className="flex items-center gap-2.5" aria-label="VaultKey secrets">
      <img src="/vaultkey-logo.png" alt="" className="h-7 w-7 object-contain" />
      <span className="font-bold tracking-tight">VaultKey</span>
    </Link>
    <button type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="app-mobile-navigation"
      onClick={() => setOpen(true)} className="sidebar-menu-toggle"><Menu size={22} /></button>
    <Modal isOpen={open} onClose={() => setOpen(false)} label="App navigation" width={280} panelClassName="mobile-nav-panel">
      <div id="app-mobile-navigation" className="flex min-h-0 flex-1 flex-col gap-4">
        <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="sidebar-menu-toggle self-end"><X size={20} /></button>
        {children}
      </div>
    </Modal>
  </div>;
};
export const SidebarLink = ({ link, className }: { link: Links; className?: string }) => {
  const { open, setOpen, animate } = useSidebar();
  return <a href={link.href} onClick={link.onClick} onFocus={() => setOpen(true)} aria-label={link.label}
    aria-current={link.isActive ? 'page' : undefined} title={!open ? link.label : undefined}
    className={cn('flex items-center gap-3 py-2.5 px-2.5 rounded-lg text-sm transition-colors',
      link.isActive ? 'bg-accent/60 text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30', className)}>
    <span className="shrink-0">{link.icon}</span>
    {(!animate || open) && <span className="truncate">{link.label}</span>}
  </a>;
};
