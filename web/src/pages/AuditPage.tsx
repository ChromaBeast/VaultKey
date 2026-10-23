import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { AuditItem } from '../lib/api';
import { apiFetch, buildQuery, errorMessage } from '../lib/api';
import { isAdminRole } from '../lib/permissions';
import { useAuth } from '../context/AuthContext';
import { pushToast } from '../lib/toast';
import { AuditTable } from '../components/AuditTable';
import { AuditPaginationBar } from '../components/AuditPaginationBar';
import { PageHeader } from '../components/ui/PageHeader';
import { buildAuditCsv, downloadCsv } from '../lib/auditCsv';

type ChainState = 'checking' | 'valid' | 'tampered' | 'error';

export const AuditPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);
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
    if (!isAdmin) return;
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
  }, [actionFilter, projectFilter, limit, offset, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    apiFetch<{ verified: boolean }>('/v1/audit/verify')
      .then((res) => {
        if (active) setChain(res.verified ? 'valid' : 'tampered');
      })
      .catch((err) => {
        if (!active) return;
        setChain("error");
        setVerifyError(errorMessage(err, 'Chain verification request failed'));
      });
    return () => { active = false; };
  }, [isAdmin]);

  const retryVerify = async () => {
    setChain('checking');
    setVerifyError(null);
    try {
      const res = await apiFetch<{ verified: boolean }>('/v1/audit/verify');
      setChain(res.verified ? 'valid' : 'tampered');
    } catch (err) {
      setChain("error");
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

  if (!isAdmin) return <div><PageHeader title="Audit Ledger" description="An administrator can review and export workspace activity." /></div>;

  return (
    <div className="animate-fade">
      <PageHeader
        title="Audit Ledger"
        actions={
          <div className="flex items-center gap-1.5">
            {chain === 'valid' && (
              <span className="badge badge-write text-xs px-3 py-1.5">
                <CheckCircle2 size={13} /> Ledger Integrity Verified
              </span>
            )}
            {chain === 'tampered' && (
              <span className="badge badge-danger text-xs px-3 py-1.5">
                <AlertTriangle size={13} /> Tamper Detected
              </span>
            )}
            {chain === 'checking' && (
              <span className="badge badge-neutral text-xs px-3 py-1.5">
                Verifying Chain...
              </span>
            )}
          </div>
        }
      />

      {verifyError && (
        <div role="alert" className="bg-destructive/10 border border-destructive/30 rounded-lg p-3.5 mb-5 flex justify-between items-center gap-2.5">
          <span className="text-destructive text-xs font-medium">Verification request failed: {verifyError}</span>
          <button onClick={() => void retryVerify()} className="btn btn-danger text-xs px-2.5 py-1">
            Retry
          </button>
        </div>
      )}

      <AuditPaginationBar
        busy={loading || Boolean(loadError)}
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
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 mb-4 text-xs font-medium">
          {loadError}
        </div>
      )}

      <AuditTable logs={logs} loading={loading} loadError={loadError} />
    </div>
  );
};
