import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSectionUI from '@/components/ui/hero-section-9';
import { Shield, KeyRound, Terminal } from 'lucide-react';
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
    subtitle:
      'A single-binary secrets engine for engineering teams. Inject encrypted credentials directly into process memory via Argon2id and AES-256-GCM zero-knowledge encryption.',
    actions: [
      {
        text: 'Get Started Free',
        onClick: () => navigate('/signup'),
        variant: 'default' as const,
        className: 'bg-primary text-black font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 px-6',
      },
      {
        text: 'View Documentation',
        onClick: () => navigate('/docs'),
        variant: 'outline' as const,
        className: 'bg-card/70 border-white/15 text-foreground hover:bg-surface-2 hover:border-primary/40 px-6',
      },
    ],
    stats: [
      {
        value: '0 ms',
        label: 'Disk exposure (RAM-only)',
        icon: <Terminal className="h-5 w-5 text-primary" />,
      },
      {
        value: '256-bit',
        label: 'AES-GCM Encryption',
        icon: <Shield className="h-5 w-5 text-primary" />,
      },
      {
        value: '100%',
        label: 'Single-binary engine',
        icon: <KeyRound className="h-5 w-5 text-primary" />,
      },
    ],
  };

  return (
    <div className="w-full">
      <HeroSectionUI
        title={heroData.title}
        subtitle={heroData.subtitle}
        actions={heroData.actions}
        stats={heroData.stats}
        visualContent={<VaultKeyHeroVisual />}
      />
    </div>
  );
};
