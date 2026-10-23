import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DevExperienceSection } from '../components/landing/devex/DevExperienceSection';
export function HowItWorksPage() {
  return <>
    <section className="marketing-page-intro section-shell">
      <h1>From your vault<br />to your running app.</h1>
      <p>Store credentials once. Use the CLI, SDK, or API to access them from your applications.</p>
      <Link to="/docs#cli" className="marketing-text-link">Open the setup guide <ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
    <DevExperienceSection />
    <section className="marketing-reading-section section-shell" aria-labelledby="integrations-title">
      <h2 id="integrations-title" className="section-title">Choose how you connect.</h2>
      <div className="marketing-connect-list">
        <Link to="/docs#cli"><h3>Command line</h3><p>Inject secrets into a child process with your usual start command.</p><ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/docs#sdk"><h3>SDKs</h3><p>Read credentials from your application's code in Node.js or Python.</p><ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/docs#mcp"><h3>MCP / AI agents</h3><p>Give Claude Code, Cursor, or Antigravity safe secret access without leaking keys into context.</p><ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/docs#api"><h3>REST API</h3><p>Connect your tools using authenticated API requests.</p><ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <p className="marketing-note">The run command avoids local secret files. Pull and export commands intentionally write plaintext to the files you choose.</p>
    </section>
  </>;
}
