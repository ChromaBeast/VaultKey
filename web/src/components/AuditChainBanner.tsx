import React from 'react';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import { IconTile, type Tone } from './ui/IconTile';

export type ChainState = 'checking' | 'valid' | 'tampered' | 'error';

interface AuditChainBannerProps {
  chain: ChainState;
  error: string | null;
  onRetry: () => void;
}

const COPY: Record<ChainState, { tone: Tone; title: string; text: string; badge: string }> = {
  valid: { tone: 'green', title: 'Chain verified', text: 'Every entry is linked and signed with HMAC-SHA256. No tampering detected.', badge: 'intact' },
  tampered: { tone: 'red', title: 'Tamper detected', text: 'The ledger failed verification. Investigate before trusting these entries.', badge: 'broken' },
  checking: { tone: 'blue', title: 'Verifying chain…', text: 'Checking every entry against its HMAC signature.', badge: 'checking' },
  error: { tone: 'amber', title: 'Verification request failed', text: 'The ledger could not be verified. Retry to check the chain again.', badge: 'unknown' },
};

export const AuditChainBanner: React.FC<AuditChainBannerProps> = ({ chain, error, onRetry }) => {
  const c = COPY[chain];
  return (
    <div role={chain === 'valid' || chain === 'checking' ? 'status' : 'alert'} className={`audit-chain-banner tone-${c.tone}`}>
      <IconTile tone={c.tone}>{chain === 'valid' || chain === 'checking' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}</IconTile>
      <div className="audit-chain-copy">
        <strong>{c.title}</strong>
        <span>{chain === 'error' && error ? error : c.text}</span>
      </div>
      {chain === 'error' || chain === 'tampered'
        ? <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}><RefreshCw size={14} aria-hidden="true" /> Retry</button>
        : <span className="badge badge-tone badge-dot">{c.badge}</span>}
    </div>
  );
};
