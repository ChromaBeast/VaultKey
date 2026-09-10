import React from 'react';
import { Command, FolderClosed, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { openCommandPalette } from '../lib/events';

interface BentoGridMetricsProps {
  totalSecrets: number;
  activeProject: string;
  projectCount: number;
}

export const BentoGridMetrics: React.FC<BentoGridMetricsProps> = ({
  totalSecrets,
  activeProject,
  projectCount,
}) => {
  const { org } = useAuth();
  const plan = org?.plan || 'free';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      <div className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--vk-border)' }}>
          <Lock size={16} color="var(--vk-accent)" />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--vk-text)', lineHeight: 1.1 }}>
            {totalSecrets}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--vk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Encrypted Secrets
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--vk-border)' }}>
          <FolderClosed size={16} color="var(--vk-accent-secondary)" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--vk-text)', lineHeight: 1.1 }}>
            {activeProject}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--vk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {projectCount} Environment{projectCount > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--vk-border)' }}>
          <ShieldCheck size={16} color="var(--vk-success)" />
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--vk-success)', lineHeight: 1.1, fontFamily: 'monospace' }}>
            AES-256-GCM
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--vk-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Argon2id Salted RAM
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={openCommandPalette}
        className="glass"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
        }}
        title="Open command palette (Cmd+K)"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--vk-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(115, 230, 255, 0.25)' }}>
            <Command size={16} color="var(--vk-accent)" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vk-text)' }}>
              Command Palette
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--vk-text-muted)' }}>
              Plan: {plan}
            </div>
          </div>
        </div>
        <kbd
          style={{
            background: 'var(--vk-surface-2)',
            border: '1px solid var(--vk-border-strong)',
            borderRadius: '4px',
            padding: '3px 7px',
            fontSize: '0.72rem',
            color: 'var(--vk-text-secondary)',
            fontFamily: 'monospace',
          }}
        >
          ⌘K
        </kbd>
      </button>
    </div>
  );
};
