import { BenefitsSection } from '../components/landing/comparison/BenefitsSection';
import { SecurityFlow } from '../components/landing/comparison/SecurityFlow';
import { PageIntro } from '../components/landing/PageIntro';
import { SecurityDocSection } from '../components/docs/SecurityDocSection';

export function SecurityPage() {
  return <>
    <PageIntro eyebrow="Security model" lead="Understand the vault" accent="before you trust it." linkTo="/docs#security" linkLabel="Read the technical security model">
      How VaultKey stores secrets, controls access, and records activity for your team.
    </PageIntro>
    <BenefitsSection />
    <section className="marketing-reading-section section-shell" aria-labelledby="security-model-title">
      <h2 id="security-model-title" className="section-title">Inside the security model.</h2>
      <SecurityFlow />
      <div className="marketing-security-model"><SecurityDocSection /></div>
      <div className="marketing-note"><h3>Know the boundary.</h3><p>VaultKey decrypts secrets in server process memory when they are read. Your application receives plaintext at runtime. Protect the server, API tokens, and application processes.</p></div>
    </section>
  </>;
}
