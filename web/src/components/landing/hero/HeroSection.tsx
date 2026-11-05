import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroTerminal } from './HeroTerminal';

const TRUST: [string, string][] = [
  ['AES-256-GCM encryption', 'var(--success)'],
  ['HMAC audit ledger', 'var(--cyan)'],
  ['CLI · SDK · MCP', 'var(--violet-light)'],
];

export const HeroSection: React.FC = () => (
  <section id="hero" className="landing-hero vk-glow vk-glow-left">
    <div className="section-shell hero-v2">
      <div className="hero-v2-copy">
        <span className="vk-pill tone-violet"><Sparkles size={14} aria-hidden="true" /> New · MCP access for AI coding agents</span>
        <h1>App secrets.<br /><span className="vk-accent-text">Outside your files.</span></h1>
        <p>Store API keys and passwords in an encrypted vault. Load them into your app at runtime. No .env files, no leaked keys.</p>
        <div className="hero-v2-cta">
          <Button asChild size="xl"><Link to="/signup">Start free <ArrowRight size={18} aria-hidden="true" /></Link></Button>
          <Button asChild variant="secondary" size="xl"><Link to="/how-it-works">How it works</Link></Button>
        </div>
        <ul className="hero-v2-trust">
          {TRUST.map(([label, color]) => (
            <li key={label}><Check size={16} strokeWidth={2.5} style={{ color }} aria-hidden="true" />{label}</li>
          ))}
        </ul>
      </div>
      <HeroTerminal />
    </div>
  </section>
);
