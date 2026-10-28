import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Terminal } from 'lucide-react';
import { HeroSection } from '../components/landing/hero/HeroSection';
import { RunCommand } from '../components/landing/devex/RunCommand';
const LEGACY_SECTIONS: Record<string, string> = {
  '#workflow': '/how-it-works', '#comparison': '/security', '#pricing': '/pricing',
};
export function LandingPage() {
  const { hash } = useLocation();
  if (LEGACY_SECTIONS[hash]) return <Navigate to={LEGACY_SECTIONS[hash]} replace />;
  return <>
    <HeroSection />
    <section className="home-overview section-shell" aria-labelledby="home-overview-title">
      <div className="home-overview-heading">
        <h2 id="home-overview-title" className="section-title">Your workflow.<br />A safer source of secrets.</h2>
        <p>Keep the commands you know. Give your app the credentials it needs from a vault your team can manage.</p>
      </div>
      <div className="home-explore-grid">
        <article className="home-workflow">
          <Terminal size={24} aria-hidden="true" />
          <h3>Keep your start command.</h3>
          <p>VaultKey injects secrets into your app process. No local secret file needed.</p>
          <RunCommand />
          <Link to="/how-it-works" className="marketing-text-link">Explore the workflow <ArrowRight size={16} aria-hidden="true" /></Link>
        </article>
        <div className="home-detail-links">
          <article>
            <LockKeyhole size={22} aria-hidden="true" />
            <h3>Know how your vault works.</h3>
            <p>Encryption, scoped access, and a record of what changed. Read the security model before you connect.</p>
            <Link to="/security" className="marketing-text-link">Why VaultKey <ArrowRight size={16} aria-hidden="true" /></Link>
          </article>
          <article>
            <h3>Start with your own project.</h3>
            <p>The free plan includes 25 secrets, two team members and two access keys. Compare plans when your team needs more.</p>
            <Link to="/pricing" className="marketing-text-link">Compare plans <ArrowRight size={16} aria-hidden="true" /></Link>
          </article>
        </div>
      </div>
    </section>
  </>;
}
