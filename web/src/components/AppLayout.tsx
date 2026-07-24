import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0e14' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '16px 24px 60px 8px', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};
