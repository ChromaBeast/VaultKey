import React, { useEffect } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/hero/HeroSection';
import { DevExperienceSection } from '../components/landing/devex/DevExperienceSection';
import { WhyNotEnvSection } from '../components/landing/comparison/WhyNotEnvSection';
import { PricingSection } from '../components/landing/pricing/PricingSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Disable automatic browser scroll restoration to prevent creeping upward shift on reloads
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div style={{ background: 'var(--vk-bg)', minHeight: '100vh', color: 'var(--vk-text)' }}>
      <LandingHeader />
      <main>
        <HeroSection />
        <DevExperienceSection />
        <WhyNotEnvSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
};
