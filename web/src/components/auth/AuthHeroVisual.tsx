import React from 'react';
import { LockKeyhole, ScrollText, Zap } from 'lucide-react';
import { IconTile, type Tone } from '@/components/ui';

const STEPS: { icon: React.ReactNode; tone: Tone; title: string; text: string }[] = [
  { icon: <LockKeyhole size={18} />, tone: 'blue', title: 'Encrypted vault', text: 'Your secrets stay protected' },
  { icon: <Zap size={18} />, tone: 'cyan', title: 'Runtime access', text: 'Injected into app memory' },
  { icon: <ScrollText size={18} />, tone: 'green', title: 'Audit ledger', text: 'Every access is signed' },
];

export const AuthHeroVisual: React.FC = () => (
  <div className="auth-visual vk-glow">
    <div className="auth-visual-content">
      <div className="auth-visual-mark"><img src="/vaultkey-logo.png" alt="VaultKey" /></div>
      <h2>Your secrets stay yours.</h2>
      <p className="auth-visual-copy">Encrypted at rest. Decrypted only when your app needs them.</p>
      <ul className="auth-flow" aria-label="How VaultKey protects secrets">
        {STEPS.map((s) => (
          <li key={s.title} className={`tone-${s.tone}`}>
            <IconTile tone={s.tone}>{s.icon}</IconTile>
            <span><strong>{s.title}</strong><small>{s.text}</small></span>
          </li>
        ))}
      </ul>
      <div className="auth-visual-footer">
        <span className="badge badge-tone tone-blue">AES-256-GCM</span>
        <span className="badge badge-tone tone-violet">RAM-only keys</span>
      </div>
    </div>
  </div>
);
