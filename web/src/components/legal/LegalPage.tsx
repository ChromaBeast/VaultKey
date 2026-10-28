import React from 'react';
import { Link } from 'react-router-dom';
import { LEGAL } from '../../lib/legal';

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-base font-bold text-foreground border-b border-border pb-2">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed mt-2 flex flex-col gap-2">{children}</div>
  </section>
);

export const LegalPage: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="min-h-screen bg-background text-foreground py-10 px-5">
    <div className="glass max-w-3xl mx-auto p-8 rounded-xl border border-border">
      <div className="mb-6 flex justify-between items-center gap-4">
        <h1 className="text-2xl font-extrabold text-primary">{title}</h1>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground shrink-0">
          &larr; Back to Home
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Last Updated: {LEGAL.lastUpdated}</p>
      {children}
      <div className="mt-8 pt-4 border-t border-border text-xs text-muted-foreground text-center flex flex-wrap justify-center gap-4">
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <Link to="/refunds" className="hover:text-foreground">Refunds &amp; Cancellation</Link>
        <Link to="/contact" className="hover:text-foreground">Contact</Link>
      </div>
    </div>
  </div>
);
