import React from 'react';
import { Command, FolderClosed, Lock, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { openCommandPalette } from '../lib/events';

interface BentoGridMetricsProps {
  totalSecrets: number;
  activeProject: string;
  projectCount: number;
}

const MetricCard: React.FC<{
  icon: LucideIcon;
  iconColor: string;
  label: string;
  children: React.ReactNode;
  glow?: boolean;
}> = ({ icon: Icon, iconColor, label, children, glow }) => (
  <div className={glow ? 'glass-glow' : 'glass'} style={{ padding: '20px', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <Icon size={19} color={iconColor} />
    </div>
    {children}
  </div>
);

export const BentoGridMetrics: React.FC<BentoGridMetricsProps> = ({
  totalSecrets,
  activeProject,
  projectCount,
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
      <MetricCard icon={Lock} iconColor="#818cf8" label="Encrypted Secrets">
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
          {totalSecrets}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          Stored in project: <strong style={{ color: '#c084fc' }}>{activeProject}</strong>
        </div>
      </MetricCard>

      <MetricCard icon={FolderClosed} iconColor="#38bdf8" label="Active Projects">
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
          {projectCount}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          Isolated environments available
        </div>
      </MetricCard>

      <MetricCard icon={ShieldCheck} iconColor="#34d399" label="Zero-Trust Vault">
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Outfit, sans-serif' }}>
          AES-256-GCM
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
          Argon2id Salted RAM Key
        </div>
      </MetricCard>

      <button
        type="button"
        onClick={openCommandPalette}
        aria-label="Open command palette"
        className="glass-glow"
        style={{
          textAlign: 'left',
          cursor: 'pointer',
          padding: '20px',
          borderRadius: '14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Actions
          </span>
          <Command size={17} color="#818cf8" />
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <kbd
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.75rem',
              color: '#f8fafc',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            Ctrl K
          </kbd>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
            Open Command Palette
          </span>
        </span>
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Plan: {plan}{subStatus === 'active' ? ' (AutoPay active)' : ''}</span>
      </button>
    </div>
  );
};
