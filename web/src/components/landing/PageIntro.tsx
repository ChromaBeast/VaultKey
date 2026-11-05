import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PageIntroProps {
  eyebrow: string;
  lead: string;
  accent: string;
  children: React.ReactNode;
  linkTo?: string;
  linkLabel?: string;
}

/** Centered page header for marketing pages: pill, two-line headline (second line accented), lede. */
export const PageIntro: React.FC<PageIntroProps> = ({ eyebrow, lead, accent, children, linkTo, linkLabel }) => (
  <section className="page-intro-v2 vk-glow" aria-labelledby="page-intro-title">
    <div className="section-shell">
      <span className="vk-pill">{eyebrow}</span>
      <h1 id="page-intro-title">{lead}<br /><span className="vk-accent-text">{accent}</span></h1>
      <p>{children}</p>
      {linkTo && linkLabel && <Link to={linkTo} className="marketing-text-link">{linkLabel} <ArrowRight size={16} aria-hidden="true" /></Link>}
    </div>
  </section>
);
