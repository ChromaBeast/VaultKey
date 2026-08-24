import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        className="glass"
        style={{
          maxWidth: '1100px',
          margin: '16px auto 0',
          padding: '10px 20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}
        >
          <ArrowLeft size={15} /> Back to home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={13} color="#fff" />
            </span>
            <span className="brand-text" style={{ fontSize: '1rem', fontWeight: 800 }}>
              VaultKey
            </span>
          </span>
          {user ? (
            <Link to="/secrets" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              Open App
            </Link>
          ) : (
            <span style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                Get Started
              </Link>
            </span>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
