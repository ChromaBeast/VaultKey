import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code2, Globe, Terminal } from 'lucide-react';
import { DevExperienceSection } from '../components/landing/devex/DevExperienceSection';
import { PageIntro } from '../components/landing/PageIntro';
import { IconTile } from '@/components/ui';

export function HowItWorksPage() {
  return <>
    <PageIntro eyebrow="The developer workflow" tone="cyan" lead="From your vault" accent="to your running app." linkTo="/docs#cli" linkLabel="Open the setup guide">
      Store credentials once. Use the CLI, SDK, or API to access them from your applications.
    </PageIntro>
    <DevExperienceSection />
    <section className="marketing-reading-section section-shell" aria-labelledby="integrations-title">
      <h2 id="integrations-title" className="section-title">Choose how you connect.</h2>
      <div className="marketing-connect-list">
        <Link to="/docs#cli"><IconTile tone="blue" size="lg"><Terminal size={22} /></IconTile><div><h3>Command line</h3><p>Inject secrets into a child process with your usual start command.</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/docs#sdk"><IconTile tone="green" size="lg"><Code2 size={22} /></IconTile><div><h3>SDKs</h3><p>Read credentials from your application's code in Node.js or Python.</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/docs#mcp"><IconTile tone="violet" size="lg"><Bot size={22} /></IconTile><div><h3>MCP / AI agents</h3><p>Give Claude Code, Cursor, or Antigravity safe secret access without leaking keys into context.</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
        <Link to="/docs#api"><IconTile tone="cyan" size="lg"><Globe size={22} /></IconTile><div><h3>REST API</h3><p>Connect your tools using authenticated API requests.</p></div><ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <p className="marketing-note">The run command avoids local secret files. Pull and export commands intentionally write plaintext to the files you choose.</p>
    </section>
  </>;
}
