import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { AuditItem } from '../lib/api';
import { apiFetch, buildQuery, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { TableSkeleton } from '../components/Skeletons';
import { AuditPaginationBar } from '../components/AuditPaginationBar';
import { PageHeader } from '../components/ui/PageHeader';
import { buildAuditCsv, downloadCsv } from '../lib/auditCsv';

type ChainState = 'checking' | 'valid' | 'tampered';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [chain, setChain] = useState<ChainState>('checking');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('');
  const [projectInput, setProjectInput] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const list = await apiFetch<AuditItem[]>(
          `/v1/audit${buildQuery({ action: actionFilter || undefined, project: projectFilter || undefined, limit, offset })}`
        );
        if (!cancelled) setLogs(list || []);
      } catch (err) {
        if (!cancelled) setLoadError(errorMessage(err, 'Failed to load audit entries'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [actionFilter, projectFilter, limit, offset]);

  useEffect(() => {
    let active = true;
    apiFetch<{ verified: boolean }>('/v1/audit/verify')
      .then((res) => {
        if (active) setChain(res.verified ? 'valid' : 'tampered');
      })
      .catch((err) => {
        if (!active) return;
        setVerifyError(errorMessage(err, 'Chain verification request failed'));
      });
    return () => { active = false; };
  }, []);

  const retryVerify = async () => {
    setChain('checking');
    setVerifyError(null);
    try {
      const res = await apiFetch<{ verified: boolean }>('/v1/audit/verify');
      setChain(res.verified ? 'valid' : 'tampered');
    } catch (err) {
      setVerifyError(errorMessage(err, 'Chain verification request failed'));
    }
  };

  const handleExport = () => {
    if (logs.length === 0) {
      pushToast('No audit entries to export', 'info');
      return;
    }
    downloadCsv(
      `vaultkey-audit-${new Date().toISOString().slice(0, 10)}.csv`,
      buildAuditCsv(logs as unknown as Record<string, unknown>[])
    );
  };

  return (
    <div className="animate-fade">
      <PageHeader
        breadcrumb="SECURITY OBSERVABILITY"
        title="Audit Ledger"
        description="Append-only cryptographic HMAC-SHA256 chained audit entries guarantee immutable log integrity."
        badge={
          <span className="badge badge-read" style={{ fontSize: '0.72rem' }}>
            HMAC-SHA256 Chained
          </span>
        }
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {chain === 'valid' && (
              <span className="badge badge-write" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <CheckCircle2 size={13} /> Ledger Integrity Verified
              </span>
            )}
            {chain === 'tampered' && (
              <span className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                <AlertTriangle size={13} /> Tamper Detected
              </span>
            )}
            {chain === 'checking' && (
              <span className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Verifying Chain...
              </span>
            )}
          </div>
        }
      />

      {verifyError && (
        <div style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(255, 107, 122, 0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--vk-danger)', fontSize: '0.85rem' }}>Verification request failed: {verifyError}</span>
          <button onClick={() => void retryVerify()} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
            Retry
          </button>
        </div>
      )}

      <AuditPaginationBar
        actionFilter={actionFilter}
        onActionChange={(v) => { setOffset(0); setActionFilter(v); }}
        projectInput={projectInput}
        onProjectInputChange={setProjectInput}
        onProjectSubmit={() => { setOffset(0); setProjectFilter(projectInput.trim()); }}
        limit={limit}
        onLimitChange={(n) => { setOffset(0); setLimit(n); }}
        offset={offset}
        onOffsetChange={setOffset}
        rowCount={logs.length}
        onExport={handleExport}
      />

      {loadError && (
        <div style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(255, 107, 122, 0.3)', color: 'var(--vk-danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem' }}>
          {loadError}
        </div>
      )}

      <div className="table-wrap glass">
        <table style={{ minWidth: '840px' }}>
          <thead>
            <tr><th>ACTION</th><th>SECRET KEY</th><th>ENVIRONMENT</th><th>ACTOR</th><th>IP ADDRESS</th><th>TIMESTAMP</th><th>HMAC SIGNATURE</th></tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton rows={6} cols={7} />}
            {!loading &&
              logs.map((l) => (
                <tr key={l.id}>
                  <td>
                    <span className={`badge badge-${l.action === 'WRITE' ? 'write' : l.action === 'READ' ? 'read' : 'admin'}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="code-font" style={{ fontWeight: 600, color: 'var(--vk-text)', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.secret_key || '-'}>
                    {l.secret_key || '—'}
                  </td>
                  <td><span className="badge badge-read" style={{ fontSize: '0.68rem' }}>{l.project || 'default'}</span></td>
                  <td className="code-font" style={{ fontSize: '0.78rem', color: 'var(--vk-text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.actor || ''}>
                    {l.actor || '—'}
                  </td>
                  <td className="code-font" style={{ color: 'var(--vk-text-muted)', fontSize: '0.78rem' }}>{l.ip_address || '—'}</td>
                  <td style={{ color: 'var(--vk-text-muted)', fontSize: '0.78rem' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td className="code-font" style={{ fontSize: '0.72rem', color: '#c084fc', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.hmac}>
                    {l.hmac}
                  </td>
                </tr>
              ))}
            {!loading && logs.length === 0 && !loadError && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--vk-text-muted)' }}>
                  No matching audit entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
