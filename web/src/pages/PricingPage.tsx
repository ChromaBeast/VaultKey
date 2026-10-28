import { Link } from 'react-router-dom';
import { PricingSection } from '../components/landing/pricing/PricingSection';
export function PricingPage() {
  return <>
    <section className="marketing-page-intro section-shell">
      <h1>Start free.<br />Grow with your team.</h1>
      <p>Try VaultKey on your own project, choose a team workspace, or discuss a custom setup.</p>
    </section>
    <h2 className="sr-only">Compare plans</h2>
    <PricingSection showHeading={false} />
    <section className="marketing-reading-section section-shell" aria-labelledby="pricing-questions-title">
      <h2 id="pricing-questions-title" className="section-title">Before you choose.</h2>
      <div className="marketing-faq">
        <details><summary>What does the free plan include?</summary><p>25 secrets, two team members and two access keys, with CLI and SDK access to run your applications.</p></details>
        <details><summary>Is Team priced per person?</summary><p>The listed ₹1,499 monthly price applies to your workspace. It is not a per-seat price.</p></details>
        <details><summary>What if I need a custom deployment?</summary><p><a href="mailto:sheersh@vaultkey.dev?subject=VaultKey%20Enterprise%20inquiry">Contact us</a> to discuss your infrastructure and requirements.</p></details>
      </div>
      <p className="marketing-note">Need to understand the product first? <Link to="/how-it-works">Explore how it works.</Link></p>
    </section>
  </>;
}
