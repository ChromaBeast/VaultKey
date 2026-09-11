import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Command } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { CommandPaletteModal } from './CommandPaletteModal';
import { CMD_OPEN_EVENT, openCommandPalette } from '../lib/events';

export const AppLayout: React.FC = () => {
  const [cmdOpen, setCmdOpen] = useState(false);

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 overflow-x-hidden">
        <div className="flex justify-end mb-4 md:mb-6">
          <button
            type="button"
            onClick={openCommandPalette}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 hover:bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors shadow-sm"
            aria-label="Open command palette"
          >
            <Command size={13} />
            <span>Search or command</span>
            <kbd className="text-[10px] bg-secondary/80 px-1.5 py-0.5 rounded border border-border/60 font-mono">⌘K</kbd>
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
