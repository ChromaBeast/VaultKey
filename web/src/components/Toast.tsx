import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'error' ? 'rgba(239, 68, 68, 0.2)' : type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)';
  const border = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1';
  const icon = type === 'error' ? '⚠️' : type === 'success' ? '✓' : 'ℹ️';

  return (
    <div
      className="animate-fade"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        background: bg,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${border}`,
        borderRadius: '12px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        fontSize: '0.9rem',
        maxWidth: '400px',
      }}
    >
      <span>{icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          fontSize: '1.1rem',
          padding: '0 4px',
        }}
      >
        ×
      </button>
    </div>
  );
};
