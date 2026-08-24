import React from 'react';
import { Dices, Plus } from 'lucide-react';

interface SecretsHeaderBarProps {
  secretCount: number;
  showBadge: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  project: string;
  projects: string[];
  onProjectChange: (value: string) => void;
  onOpenGenerator: () => void;
  onCreateSecret: () => void;
}

export const SecretsHeaderBar: React.FC<SecretsHeaderBarProps> = ({
  secretCount,
  showBadge,
  search,
  onSearchChange,
  project,
  projects,
  onProjectChange,
  onOpenGenerator,
  onCreateSecret,
}) => (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Vault Secrets</h1>
          {showBadge && (
            <span className="badge badge-admin">{secretCount} secrets in this project</span>
          )}
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
          Zero-trust end-to-end encrypted under team master key (AES-256-GCM)
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onOpenGenerator} className="btn btn-secondary">
          <Dices size={15} /> Generator
        </button>
        <button onClick={onCreateSecret} className="btn btn-primary">
          <Plus size={15} /> New Secret
        </button>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <input
        className="input"
        placeholder="Search secrets... (Ctrl+K for command palette)"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search secrets"
        style={{ maxWidth: '380px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Project:</span>
        <select className="input" value={project} onChange={(e) => onProjectChange(e.target.value)} style={{ width: '180px' }} aria-label="Select project">
          {projects.map((p) => (<option key={p} value={p}>{p}</option>))}
        </select>
      </div>
    </div>
  </>
);
