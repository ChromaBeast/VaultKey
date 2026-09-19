import React from 'react';
import { Lock } from 'lucide-react';

export const AuthHeroVisual: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '540px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(91, 141, 239, 0.05) 0%, transparent 70%), var(--vk-bg)',
        borderLeft: '1px solid var(--vk-border)',
      }}
    >
      {/* Subtle Grid Accent */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Quiet Geometric Vault Icon */}
      <div
        style={{
          position: 'relative',
          width: '96px',
          height: '96px',
          borderRadius: '20px',
          background: 'var(--vk-surface-1)',
          border: '1px solid var(--vk-border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <Lock size={36} color="var(--vk-accent)" strokeWidth={1.5} />
      </div>
    </div>
  );
};
