import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { CommandPaletteModal } from './CommandPaletteModal';
import { CMD_OPEN_EVENT } from '../lib/events';

export const AppLayout: React.FC = () => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    const handleCmdOpen = () => setCmdOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener(CMD_OPEN_EVENT, handleCmdOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(CMD_OPEN_EVENT, handleCmdOpen);
    };
  }, []);

  return (
    <div className={navOpen ? 'nav-open' : ''} style={{ display: 'flex', minHeight: '100vh', background: '#0b0e14' }}>
      <Sidebar mobileOpen={navOpen} onMobileClose={() => setNavOpen(false)} />
      {navOpen && (
        <button
          type="button"
          className="app-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}
      <main className="app-main" style={{ flex: 1, padding: '16px 24px 60px 8px', overflowX: 'hidden' }}>
        <div style={{ marginBottom: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary app-hamburger"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((o) => !o)}
          >
            <Menu size={17} /> Menu
          </button>
        </div>
        <Outlet />
      </main>
      {cmdOpen && <CommandPaletteModal isOpen onClose={() => setCmdOpen(false)} />}
    </div>
  );
};
