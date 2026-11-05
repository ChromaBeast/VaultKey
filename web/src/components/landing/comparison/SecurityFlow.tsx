import React from 'react';
import { ArrowRight, Database, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { IconTile, type Tone } from '@/components/ui';

const NODES: { icon: React.ReactNode; tone: Tone; title: string; text: string }[] = [
  { icon: <Terminal size={26} />, tone: 'blue', title: 'Your app', text: 'Calls the CLI, SDK or API with a scoped token' },
  { icon: <ShieldCheck size={26} />, tone: 'violet', title: 'VaultKey API', text: 'Checks role and scope, writes an audit entry' },
  { icon: <Database size={26} />, tone: 'cyan', title: 'Encrypted store', text: 'Ciphertext only. Keys are wrapped per member' },
  { icon: <Zap size={26} />, tone: 'green', title: 'Runtime memory', text: 'Plaintext exists only in your process' },
];

export const SecurityFlow: React.FC = () => (
  <div className="glass security-flow" role="list" aria-label="How a secret moves from request to runtime">
    {NODES.flatMap((n, i) => [
      <div key={n.title} role="listitem"><IconTile tone={n.tone} size="xl">{n.icon}</IconTile><h3>{n.title}</h3><p>{n.text}</p></div>,
      ...(i < NODES.length - 1 ? [<ArrowRight key={`a${i}`} size={24} aria-hidden="true" />] : []),
    ])}
  </div>
);
