import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Command } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { CommandPaletteModal } from './CommandPaletteModal';
import { CMD_OPEN_EVENT, openCommandPalette } from '../lib/events';

type AppTheme = 'dark' | 'light';

export const AppLayout: React.FC = () => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      return window.localStorage.getItem('vk-dashboard-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
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

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      window.localStorage.setItem('vk-dashboard-theme', nextTheme);
    } catch {
      // Keep the in-memory preference for this session if storage is unavailable.
    }
  };

  return (
    <div data-theme={theme} className="app-frame flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-main flex-1 flex flex-col min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 overflow-x-hidden">
        <div className="app-toolbar mb-4 flex flex-wrap items-center justify-end gap-4 md:mb-6">
          <Link
            to="/docs"
            aria-label="Open developer documentation"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Help &amp; Docs</span>
          </Link>
          <button
            type="button"
            onClick={openCommandPalette}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 hover:bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open command palette"
          >
            <Command size={13} />
            <span className="hidden sm:inline">Search or command</span>
            <kbd className="hidden rounded border border-border/60 bg-secondary/80 px-1.5 py-0.5 font-mono text-xs sm:inline-flex">⌘ / Ctrl K</kbd>
          </button>
        </div>
        <div className="max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </div>
      </main>
      {cmdOpen && <CommandPaletteModal isOpen onClose={() => setCmdOpen(false)} />}
    </div>
  );
};

export default AppLayout;
