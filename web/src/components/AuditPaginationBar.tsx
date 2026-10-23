import React from 'react';
import { Download } from 'lucide-react';
import { Input, Select } from './ui';

interface AuditFiltersBarProps {
  busy: boolean;
  actionFilter: string;
  onActionChange: (value: string) => void;
  projectInput: string;
  onProjectInputChange: (value: string) => void;
  onProjectSubmit: () => void;
  limit: number;
  onLimitChange: (value: number) => void;
  offset: number;
  onOffsetChange: (value: number) => void;
  rowCount: number;
  onExport: () => void;
}

export const AuditPaginationBar: React.FC<AuditFiltersBarProps> = ({
  busy,
  actionFilter,
  onActionChange,
  projectInput,
  onProjectInputChange,
  onProjectSubmit,
  limit,
  onLimitChange,
  offset,
  onOffsetChange,
  rowCount,
  onExport,
}) => (
  <div className="mb-5">
    <div className="audit-filter-bar flex items-center gap-2.5 flex-wrap">
      <div className="w-32">
        <Select
          id="audit-action-filter"
          value={actionFilter}
          onChange={(e) => onActionChange(e.target.value)}
          aria-label="Filter by action"
        >
          <option value="">All Actions</option>
          <option value="READ">READ</option>
          <option value="WRITE">WRITE</option>
          <option value="DELETE">DELETE</option>
          <option value="ROLLBACK">ROLLBACK</option>
          <option value="LOCK">LOCK</option>
        </Select>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onProjectSubmit(); }} className="flex items-center gap-2 flex-1 min-w-0 basis-56 max-w-sm">
        <Input
          id="audit-project-filter"
          placeholder="Filter by project..."
          value={projectInput}
          onChange={(e) => onProjectInputChange(e.target.value)}
          aria-label="Filter by project"
        />
        <button type="submit" className="btn btn-secondary">Apply</button>
      </form>

      <div className="w-28">
        <Select
          id="audit-limit-select"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {[25, 50, 100, 200].map((n) => (
            <option key={n} value={n}>{n} rows</option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={onExport}
          className="btn btn-secondary text-xs px-3 py-1.5"
          title="Export the current page"
          disabled={busy || rowCount === 0}
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
    </div>

    <div className="flex justify-between items-center mt-2.5 text-xs text-muted-foreground">
      <span aria-live="polite">{busy ? "Loading events…" : rowCount === 0 ? '0 events' : `${offset + 1} to ${offset + rowCount} events`}</span>
      <div className="flex gap-1.5">
        <button
          className="btn btn-secondary text-xs px-2.5 py-1"
          disabled={busy || offset === 0}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary text-xs px-2.5 py-1"
          disabled={busy || rowCount < limit}
          onClick={() => onOffsetChange(offset + limit)}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
