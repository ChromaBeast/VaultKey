import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSectionUI from '@/components/ui/hero-section-9';
import { Shield, KeyRound, Terminal } from 'lucide-react';

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
      },
      {
        text: 'View Documentation',
        onClick: () => navigate('/docs'),
        variant: 'outline' as const,
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
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    ],
  };

  return (
    <div className="w-full">
      <HeroSectionUI
        title={heroData.title}
        subtitle={heroData.subtitle}
        actions={heroData.actions}
        stats={heroData.stats}
        images={heroData.images}
      />
    </div>
  );
};
