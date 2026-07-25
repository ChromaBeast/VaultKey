import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CommandPaletteModal } from './CommandPaletteModal';

export const AppLayout: React.FC = () => {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0e14' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '16px 24px 60px 8px', overflowX: 'hidden' }}>
        <Outlet />
      </main>
      <CommandPaletteModal isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
};
