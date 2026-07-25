import React from 'react';
import { useAuth } from '../context/AuthContext';

interface BentoGridMetricsProps {
  totalSecrets: number;
  activeProject: string;
  projectCount: number;
  onOpenCmdPalette: () => void;
}

export const BentoGridMetrics: React.FC<BentoGridMetricsProps> = ({
  totalSecrets,
  activeProject,
  projectCount,
  onOpenCmdPalette,
}) => {
  const { org } = useAuth();
  const plan = org?.plan || 'free';
  const subStatus = org?.subscription_status || 'none';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {/* Total Secrets Card */}
      <div className="glass" style={{ padding: '20px', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Encrypted Secrets
          </span>
          <span style={{ fontSize: '1.2rem' }}>🔐</span>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
          {totalSecrets}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '4px' }}>
          Active in project: <strong style={{ color: '#c084fc' }}>{activeProject}</strong>
        </div>
      </div>

      {/* Projects & Environments */}
      <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Projects
          </span>
          <span style={{ fontSize: '1.2rem' }}>📁</span>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
          {projectCount}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
          Isolated environments available
        </div>
      </div>

      {/* Encryption & RAM Locks */}
      <div className="glass" style={{ padding: '20px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Zero-Trust Vault
          </span>
          <span style={{ fontSize: '1.2rem' }}>🛡️</span>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Outfit, sans-serif' }}>
          AES-256-GCM
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          Argon2id Salted RAM Key
        </div>
      </div>

      {/* Subscription & Quick Command */}
      <div
        className="glass-glow"
        style={{
          padding: '20px',
          borderRadius: '14px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onClick={onOpenCmdPalette}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Actions
          </span>
          <span className="badge badge-admin" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
            {plan} {subStatus === 'active' ? 'AutoPay' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <kbd
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.75rem',
              color: '#f8fafc',
              fontFamily: 'monospace',
            }}
          >
            ⌘K
          </kbd>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
            Open Command Palette
          </span>
        </div>
      </div>
    </div>
  );
};
