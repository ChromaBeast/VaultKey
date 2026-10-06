import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BenefitsSection } from '../components/landing/comparison/BenefitsSection';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';
export function SecurityPage() {
  return <>
    <section className="marketing-page-intro section-shell">
      <h1>Understand the vault<br />before you trust it.</h1>
      <p>How VaultKey stores secrets, controls access, and records activity for your team.</p>
      <Link to="/docs#security" className="marketing-text-link">Read the technical security model <ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
    <BenefitsSection />
    <section className="marketing-reading-section section-shell" aria-labelledby="security-model-title">
      <h2 id="security-model-title" className="section-title">Inside the security model.</h2>
      <div className="marketing-security-model"><SecurityDocSection /></div>
      <div className="marketing-note"><h3>Know the boundary.</h3><p>VaultKey decrypts secrets in server process memory when they are read. Your application receives plaintext at runtime. Protect the server, API tokens, and application processes.</p></div>
    </section>
  </>;
}
