import React from 'react';
import { Link } from 'react-router-dom';
import { LEGAL } from '../../lib/legal';

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section id={slug(title)} className="glass legal-card">
    <h2>{title}</h2>
    <div>{children}</div>
  </section>
);

export const LegalPage: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const sections = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<{ title: string }> => React.isValidElement(child) && typeof (child.props as { title?: unknown }).title === 'string')
    .map((child) => child.props.title);
  return (
    <>
      <section className="page-intro-v2 vk-glow" style={{ textAlign: 'left' }}>
        <div className="section-shell" style={{ justifyItems: 'start', paddingBottom: 40 }}>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link><span aria-hidden="true">/</span><span className="text-[#cbd5e1]">{title}</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)' }}>{title}</h1>
          <p style={{ fontSize: '1rem' }}>Last updated {LEGAL.lastUpdated}</p>
        </div>
      </section>
      <div className="section-shell legal-v2" style={{ paddingTop: 0 }}>
        {sections.length > 1 && (
          <nav className="legal-toc" aria-label="On this page">
            <p>On this page</p>
            {sections.map((s) => <a key={s} href={`#${slug(s)}`}>{s}</a>)}
          </nav>
        )}
        <div className="legal-content" style={sections.length > 1 ? undefined : { gridColumn: '1 / -1' }}>{children}</div>
      </div>
    </>
  );
};
