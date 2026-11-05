import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, ScrollText, Server, Users } from 'lucide-react';
import { IconTile, type Tone } from '@/components/ui';

const PILLARS: { icon: React.ReactNode; tone: Tone; title: string; text: string }[] = [
  { icon: <Lock size={22} />, tone: 'blue', title: 'Encrypted at rest', text: 'AES-256-GCM with random 12-byte nonces. The master key derives in RAM on unlock and clears when the vault locks.' },
  { icon: <Users size={22} />, tone: 'violet', title: 'Scoped access', text: 'Scoped machine tokens (admin, write, read) for services and pipelines. Secrets inject into process memory without touching disk.' },
  { icon: <ScrollText size={22} />, tone: 'green', title: 'Tamper-evident audit', text: 'Every secret mutation and read chains to the previous entry with HMAC-SHA256, enabling live tamper verification.' },
  { icon: <Server size={22} />, tone: 'cyan', title: 'RAM-only keys', text: 'Unwrapped keys live in server memory. They are never written to disk or logged.' },
];

export const BenefitsList: React.FC = () => (
  <div>
    <div className="security-pillars">
      {PILLARS.map((p) => (
        <article key={p.title} className="glass">
          <IconTile tone={p.tone} size="lg">{p.icon}</IconTile>
          <h3>{p.title}</h3>
          <p>{p.text}</p>
        </article>
      ))}
    </div>
    <Link to="/docs#security" className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium">
      Explore encryption and the audit ledger <ArrowRight size={14} aria-hidden="true" />
    </Link>
  </div>
);
