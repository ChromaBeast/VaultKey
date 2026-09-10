import React, { useEffect } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/hero/HeroSection';
import { TrustProofBar } from '../components/landing/hero/TrustProofBar';
import { ArchitectureSection } from '../components/landing/architecture/ArchitectureSection';
import { DevExperienceSection } from '../components/landing/devex/DevExperienceSection';
import { WhyNotEnvSection } from '../components/landing/comparison/WhyNotEnvSection';
import { PricingSection } from '../components/landing/pricing/PricingSection';
import { FaqSection } from '../components/landing/faq/FaqSection';
import { FinalCtaSection } from '../components/landing/cta/FinalCtaSection';
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
    <div style={{ background: '#080a0f', minHeight: '100vh', color: '#f5f7fa' }}>
      <LandingHeader />
      <main>
        <HeroSection />
        <TrustProofBar />
        <ArchitectureSection />
        <DevExperienceSection />
        <WhyNotEnvSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};
