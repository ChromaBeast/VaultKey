import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSectionUI from '@/components/ui/hero-section-9';
import { VaultKeyHeroVisual } from './VaultKeyHeroVisual';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const heroData = {
    title: (
      <>
        Secrets in runtime memory. <br />
        <span className="text-primary">Never on disk.</span>
      </>
    ),
    actions: [
      {
        text: 'Get Started',
        onClick: () => navigate('/signup'),
        variant: 'default' as const,
        className: 'bg-primary text-white font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 px-6',
      },
      {
        text: 'Documentation',
        onClick: () => navigate('/docs'),
        variant: 'outline' as const,
        className: 'bg-card/70 border-white/15 text-foreground hover:bg-surface-2 hover:border-primary/40 px-6',
      },
    ],
  };

  return (
    <section
      id="hero"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 24px 32px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <HeroSectionUI
        title={heroData.title}
        actions={heroData.actions}
        visualContent={<VaultKeyHeroVisual />}
      />
    </section>
  );
};
