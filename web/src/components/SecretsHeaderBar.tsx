import React from 'react';
import { KeyRound, Plus, Search } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';
import { Input, Select } from './ui';

interface SecretsHeaderBarProps {
  canWrite: boolean;
  secretCount: number;
  showBadge: boolean;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  project: string;
  projects: string[];
  onProjectChange: (value: string) => void;
  onOpenGenerator: () => void;
  onCreateSecret: () => void;
}

export const SecretsHeaderBar: React.FC<SecretsHeaderBarProps> = ({
  canWrite,
  secretCount,
  showBadge,
  loading,
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
      title="Secrets"
      badge={
        showBadge ? (
          <span className="app-page-meta">
            {loading ? 'Loading secrets…' : `${secretCount} secret${secretCount !== 1 ? 's' : ''}`}
          </span>
        ) : undefined
      }
      description="Encrypted values for your applications."
      actions={
        <>
          <button hidden={!canWrite} onClick={onOpenGenerator} className="btn btn-secondary">
            <KeyRound size={14} /> Generator
          </button>
          <button hidden={!canWrite} onClick={onCreateSecret} className="btn btn-primary">
            <Plus size={14} /> New Secret
          </button>
        </>
      }
    />

    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex-1 min-w-0 basis-56 max-w-md">
        <Input
          icon={<Search size={15} />}
          placeholder="Filter secrets…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Filter secrets"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="secrets-project" className="text-sm font-semibold text-muted-foreground">
          Project:
        </label>
        <div className="w-40">
          <Select
            id="secrets-project"
            value={project}
            onChange={(e) => onProjectChange(e.target.value)}
            aria-label="Select project"
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
