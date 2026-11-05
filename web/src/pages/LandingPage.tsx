import { Navigate, useLocation } from 'react-router-dom';
import { HeroSection } from '../components/landing/hero/HeroSection';
import { ConnectGrid, CtaBand, FeatureGrid, SecurityBand, StackStrip, WorkflowSteps } from '../components/landing/home/HomeSections';

const LEGACY_SECTIONS: Record<string, string> = {
  '#workflow': '/how-it-works', '#comparison': '/security', '#pricing': '/pricing',
};

export function LandingPage() {
  const { hash } = useLocation();
  if (LEGACY_SECTIONS[hash]) return <Navigate to={LEGACY_SECTIONS[hash]} replace />;
  return <>
    <HeroSection />
    <StackStrip />
    <FeatureGrid />
    <WorkflowSteps />
    <ConnectGrid />
    <SecurityBand />
    <CtaBand />
  </>;
}
