import React from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { BentoGridSection } from '../components/landing/BentoGridSection';
import { ArchitectureSection } from '../components/landing/ArchitectureSection';
import { PricingTeaserSection } from '../components/landing/PricingTeaserSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ background: '#0b0e14', minHeight: '100vh', color: '#f8fafc', overflowX: 'hidden' }}>
      <LandingHeader />
      <main>
        <HeroSection />
        <BentoGridSection />
        <ArchitectureSection />
        <PricingTeaserSection />
      </main>
      <LandingFooter />
    </div>
  );
};
