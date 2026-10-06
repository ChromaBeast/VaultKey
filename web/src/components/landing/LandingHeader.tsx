import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
const NAV_LINKS = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/security', label: 'Why VaultKey' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/docs', label: 'Docs' },
];
export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);
  const renderLinks = () => NAV_LINKS.map(({ to, label }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'marketing-nav-link is-active' : 'marketing-nav-link'}>{label}</NavLink>);
  return <header ref={root} className="marketing-header">
    <div className="marketing-header-inner">
      <Link to="/" className="marketing-brand" aria-label="VaultKey home" onClick={() => setOpen(false)}>
        <img src="/vaultkey-logo.png" alt="" width="32" height="32" />
        <span className="brand-text">VaultKey</span>
      </Link>
      <nav aria-label="Main navigation" className="marketing-desktop-nav">{renderLinks()}</nav>
      <div className="marketing-account">
        <Link to="/login" className="marketing-signin">Sign in</Link>
        <Button asChild size="sm"><Link to="/signup">Start free</Link></Button>
        <button ref={trigger} type="button" className="marketing-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="marketing-mobile-nav" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </div>
    <nav id="marketing-mobile-nav" aria-label="Mobile navigation" className="marketing-mobile-nav" hidden={!open}>
      {renderLinks()}
      <Link to="/login" className="marketing-nav-link" onClick={() => setOpen(false)}>Sign in</Link>
    </nav>
  </header>;
}
