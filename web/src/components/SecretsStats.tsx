import React from 'react';
import { Clock, FolderOpen, GitCommitVertical, Lock } from 'lucide-react';
import type { SecretItem } from '../lib/api';
import { StatCard } from './ui/StatCard';

const relative = (iso: string): string => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

/** Four quick numbers about the current project, derived from the loaded secrets. */
export const SecretsStats: React.FC<{ secrets: SecretItem[]; project: string }> = ({ secrets, project }) => {
  if (secrets.length === 0) return null;
  const envs = Array.from(new Set(secrets.map((s) => s.env || 'default')));
  const latest = secrets.reduce((a, b) => (new Date(b.updated_at) > new Date(a.updated_at) ? b : a));
  const revisions = secrets.reduce((sum, s) => sum + s.version, 0);
  return (
    <div className="secrets-stats" aria-label="Project summary">
      <StatCard label="Secrets" value={secrets.length} hint={`in ${project}`} icon={<Lock size={16} />} tone="blue" />
      <StatCard label="Environments" value={envs.length} hint={envs.slice(0, 3).join(' · ')} icon={<FolderOpen size={16} />} tone="violet" />
      <StatCard label="Last change" value={relative(latest.updated_at)} hint={`${latest.key} v${latest.version}`} icon={<Clock size={16} />} tone="cyan" />
      <StatCard label="Revisions" value={revisions} hint="versions across all keys" icon={<GitCommitVertical size={16} />} tone="green" />
    </div>
  );
};
