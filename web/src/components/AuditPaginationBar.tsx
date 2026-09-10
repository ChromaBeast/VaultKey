import React from 'react';
import { Download } from 'lucide-react';

interface AuditFiltersBarProps {
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
  <div style={{ marginBottom: '20px' }}>
    <div
      className="glass"
      style={{
        padding: '10px 14px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <select
        id="audit-action-filter"
        className="input"
        value={actionFilter}
        onChange={(e) => onActionChange(e.target.value)}
        style={{ width: '130px', padding: '6px 10px', fontSize: '0.8rem' }}
        aria-label="Filter by action"
      >
        <option value="">All Actions</option>
        <option value="READ">READ</option>
        <option value="WRITE">WRITE</option>
        <option value="DELETE">DELETE</option>
        <option value="ROLLBACK">ROLLBACK</option>
        <option value="LOCK">LOCK</option>
      </select>

      <form onSubmit={(e) => { e.preventDefault(); onProjectSubmit(); }} style={{ flex: '1 1 180px', maxWidth: '240px' }}>
        <input
          id="audit-project-filter"
          className="input"
          placeholder="Filter by environment..."
          value={projectInput}
          onChange={(e) => onProjectInputChange(e.target.value)}
          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          aria-label="Filter by environment"
        />
      </form>

      <select
        id="audit-limit-select"
        className="input"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        style={{ width: '100px', padding: '6px 10px', fontSize: '0.8rem' }}
        aria-label="Rows per page"
      >
        {[25, 50, 100, 200].map((n) => (
          <option key={n} value={n}>{n} rows</option>
        ))}
      </select>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
        <button
          onClick={onExport}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          title="Export CSV"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.78rem', color: 'var(--vk-text-muted)' }}>
      <span>Showing {rowCount} event{rowCount === 1 ? '' : 's'} (offset {offset})</span>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          className="btn btn-secondary"
          disabled={offset === 0}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          disabled={rowCount < limit}
          onClick={() => onOffsetChange(offset + limit)}
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
