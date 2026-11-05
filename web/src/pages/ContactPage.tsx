import React from 'react';
import { FileText, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IconTile, type Tone } from '../components/ui/IconTile';
import { LEGAL } from '../lib/legal';

interface ContactCard { icon: React.ReactNode; tone: Tone; title: string; lead: string; body: React.ReactNode; note?: string }

export const ContactPage: React.FC = () => {
  const mail = (subject?: string) => `mailto:${LEGAL.supportEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  const cards: ContactCard[] = [
    {
      icon: <Mail size={22} />, tone: 'blue', title: 'Support and billing', lead: 'Email us for product help, plan changes or billing questions.',
      body: <><a className="contact-mail" href={mail()}>{LEGAL.supportEmail}</a>{LEGAL.phone && <p>Phone: {LEGAL.phone}</p>}</>,
      note: 'We reply within two business days. For billing issues, include your organization name and payment ID.',
    },
    ...((LEGAL.legalEntity || LEGAL.address) ? [{
      icon: <FileText size={22} />, tone: 'violet' as const, title: 'Registered business', lead: 'Legal entity and address for invoices and agreements.',
      body: <>{LEGAL.legalEntity && <p className="contact-entity">{LEGAL.legalEntity}</p>}{LEGAL.address && <p className="whitespace-pre-line">{LEGAL.address}</p>}</>,
    }] : []),
    {
      icon: <ShieldCheck size={22} />, tone: 'amber', title: 'Security reports', lead: 'Found a vulnerability? Send steps to reproduce.',
      body: <a className="contact-mail" href={mail('Security report')}>{LEGAL.supportEmail}</a>,
      note: 'Please give us reasonable time to fix it before public disclosure.',
    },
  ];
  return (
    <>
      <section className="page-intro-v2 vk-glow" style={{ textAlign: 'left' }}>
        <div className="section-shell" style={{ justifyItems: 'start', paddingBottom: 40 }}>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link><span aria-hidden="true">/</span><span className="text-[#cbd5e1]">Contact us</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)' }}>Contact us</h1>
          <p style={{ fontSize: '1rem' }}>We reply within two business days.</p>
        </div>
      </section>
      <div className="section-shell contact-grid" style={{ paddingTop: 0 }}>
        {cards.map((c) => (
          <article key={c.title} className="glass contact-card">
            <IconTile tone={c.tone} size="lg">{c.icon}</IconTile>
            <h2>{c.title}</h2>
            <p>{c.lead}</p>
            <div className="contact-body">{c.body}</div>
            {c.note && <small>{c.note}</small>}
          </article>
        ))}
      </div>
    </>
  );
};
