import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { AuditItem } from '../lib/api';
import { apiFetch, buildQuery, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { AuditTable } from '../components/AuditTable';
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
        title="Audit Ledger"
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
        <div style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
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
        <div style={{ background: 'var(--vk-danger-dim)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--vk-danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem' }}>
          {loadError}
        </div>
      )}

      <AuditTable logs={logs} loading={loading} loadError={loadError} />
    </div>
  );
};
