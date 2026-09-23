import React from 'react';
import { ArrowDown, Check, LockKeyhole } from 'lucide-react';

export const AuthHeroVisual: React.FC = () => (
  <div className="auth-visual">
    <div className="auth-visual-grid" aria-hidden="true" />
    <div className="auth-visual-content">
      <div className="auth-visual-mark">
        <img src="/vaultkey-logo.png" alt="VaultKey" />
      </div>
      <p className="auth-visual-kicker">Built for your workflow</p>
      <h2>Your secrets stay yours.</h2>
      <p className="auth-visual-copy">Encrypted at rest. Decrypted only when your app needs them.</p>

      <div className="auth-flow" aria-label="How VaultKey protects secrets">
        <div className="auth-flow-step">
          <span className="auth-flow-icon"><LockKeyhole size={16} /></span>
          <span><strong>Encrypted vault</strong><small>Your secrets stay protected</small></span>
          <Check size={15} className="auth-flow-check" />
        </div>
        <div className="auth-flow-connector"><ArrowDown size={14} /></div>
        <div className="auth-flow-step">
          <span className="auth-flow-icon"><img src="/vaultkey-logo.png" alt="" /></span>
          <span><strong>Runtime access</strong><small>Injected into app memory</small></span>
          <Check size={15} className="auth-flow-check" />
        </div>
      </div>

      <div className="auth-visual-footer"><span /> AES-256-GCM <i /> RAM-only keys</div>
    </div>
  </div>
);
