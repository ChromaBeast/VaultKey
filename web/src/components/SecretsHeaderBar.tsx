import React from 'react';
import { Dices, Plus, Search } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';

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
    <PageHeader
      breadcrumb="VAULT SECRETS"
      title="Secrets"
      description="Zero-trust end-to-end encrypted under team master key (AES-256-GCM)."
      badge={
        showBadge ? (
          <span className="badge badge-read" style={{ fontSize: '0.72rem' }}>
            {secretCount} secret{secretCount !== 1 ? 's' : ''} in {project}
          </span>
        ) : undefined
      }
      actions={
        <>
          <button onClick={onOpenGenerator} className="btn btn-secondary">
            <Dices size={14} /> Generator
          </button>
          <button onClick={onCreateSecret} className="btn btn-primary">
            <Plus size={14} /> New Secret
          </button>
        </>
      }
    />

    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '420px' }}>
        <Search
          size={15}
          color="var(--vk-text-muted)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
        <input
          className="input"
          placeholder="Search secrets... (⌘K for command palette)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search secrets"
          style={{ paddingLeft: '36px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--vk-text-muted)', fontWeight: 600 }}>Environment:</span>
        <select
          className="input"
          value={project}
          onChange={(e) => onProjectChange(e.target.value)}
          style={{ width: '160px', padding: '7px 10px', fontSize: '0.825rem' }}
          aria-label="Select environment"
        >
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  </>
);
