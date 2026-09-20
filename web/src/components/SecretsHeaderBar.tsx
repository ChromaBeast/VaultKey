import React from 'react';
import { Dices, Plus, Search } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';
import { Input, Select } from './ui';

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
      <div style={{ flex: '1 1 300px', maxWidth: '420px' }}>
        <Input
          icon={<Search size={15} />}
          placeholder="Filter secrets…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Filter secrets"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--vk-text-muted)', fontWeight: 600 }}>Environment:</span>
        <div style={{ width: '160px' }}>
          <Select
            value={project}
            onChange={(e) => onProjectChange(e.target.value)}
            aria-label="Select environment"
          >
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  </>
);
