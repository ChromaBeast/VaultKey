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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '4px',
};

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
  <>
    <div className="glass" style={{ padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div>
        <label htmlFor="audit-action-filter" style={labelStyle}>Action</label>
        <select id="audit-action-filter" className="input" value={actionFilter} onChange={(e) => onActionChange(e.target.value)} style={{ width: '150px' }}>
          <option value="">All actions</option>
          <option value="READ">READ</option>
          <option value="WRITE">WRITE</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onProjectSubmit(); }}>
        <label htmlFor="audit-project-filter" style={labelStyle}>Project</label>
        <input id="audit-project-filter" className="input" placeholder="Filter by project" value={projectInput} onChange={(e) => onProjectInputChange(e.target.value)} style={{ width: '180px' }} />
      </form>
      <div>
        <label htmlFor="audit-limit-select" style={labelStyle}>Rows</label>
        <select id="audit-limit-select" className="input" value={limit} onChange={(e) => onLimitChange(Number(e.target.value))} style={{ width: '100px' }}>
          {[25, 50, 100, 200].map((n) => (<option key={n} value={n}>{n}</option>))}
        </select>
      </div>
      <button onClick={onExport} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
        <Download size={15} /> Export CSV
      </button>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
        Showing {rowCount} entr{rowCount === 1 ? 'y' : 'ies'} at offset {offset}
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-secondary" disabled={offset === 0} onClick={() => onOffsetChange(Math.max(0, offset - limit))} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          Previous
        </button>
        <button className="btn btn-secondary" disabled={rowCount < limit} onClick={() => onOffsetChange(offset + limit)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          Next
        </button>
      </div>
    </div>
  </>
);
