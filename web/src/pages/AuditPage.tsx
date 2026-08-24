import React, { useEffect, useState } from 'react';
import { ShieldCheck, ScrollText } from 'lucide-react';
import type { AuditItem } from '../lib/api';
import { apiFetch, buildQuery, errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { StatCard } from '../components/StatCard';
import { TableSkeleton } from '../components/Skeletons';
import { AuditPaginationBar } from '../components/AuditPaginationBar';
import { buildAuditCsv, downloadCsv } from '../lib/auditCsv';

type ChainState = 'checking' | 'valid' | 'tampered';

const CHAIN_META: Record<ChainState, { label: string; badgeClass: string; accent: string }> = {
  checking: { label: 'Checking chain integrity', badgeClass: 'badge-neutral', accent: '#94a3b8' },
  valid: { label: 'HMAC chain verified', badgeClass: 'badge-write', accent: '#10b981' },
  tampered: { label: 'Tamper detected in HMAC chain', badgeClass: 'badge-danger', accent: '#ef4444' },
};

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
    return () => {
      cancelled = true;
    };
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
    return () => {
      active = false;
    };
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

  const meta = CHAIN_META[chain];

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Tamper-Evident Audit Ledger</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
            HMAC-SHA256 chained audit entries guarantee immutable security log integrity
          </p>
        </div>
        <span className={`badge ${meta.badgeClass}`} style={{ padding: '8px 16px', fontSize: '0.8rem' }} role="status">
          {meta.label}
        </span>
      </div>

      {verifyError && (
        <div role="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: '#f87171', fontSize: '0.875rem' }}>Could not verify chain integrity: {verifyError}</span>
          <button onClick={() => void retryVerify()} className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            Retry verification
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard icon={<ScrollText size={21} />} title="Total Events" value={logs.length} subtitle="Recorded activity" accentColor="#8b5cf6" />
        <StatCard icon={<ShieldCheck size={21} />} title="Ledger Type" value="HMAC Chain" subtitle="Cryptographically linked" accentColor="#06b6d4" />
        <StatCard icon={<ShieldCheck size={21} />} title="Chain Status" value={chain === 'checking' ? 'Checking' : chain === 'valid' ? 'Valid' : 'Tampered'} subtitle="Zero-Trust Audit" accentColor={meta.accent} />
      </div>

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
        <div role="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', borderRadius: '12px', padding: '12px 18px', marginBottom: '20px', fontSize: '0.85rem' }}>
          {loadError}
        </div>
      )}

      <div className="glass table-wrap">
        <table style={{ width: '100%', minWidth: '850px' }}>
          <thead>
            <tr><th>ACTION</th><th>SECRET KEY</th><th>PROJECT</th><th>ACTOR</th><th>IP ADDRESS</th><th>TIMESTAMP</th><th>HMAC SIGNATURE</th></tr>
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
                  <td className="code-font" style={{ fontWeight: 600, color: '#f8fafc', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.secret_key || '-'}>
                    {l.secret_key || '-'}
                  </td>
                  <td><span className="badge badge-read">{l.project || 'default'}</span></td>
                  <td className="code-font" style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.actor || ''}>
                    {l.actor || '\u2014'}
                  </td>
                  <td className="code-font" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{l.ip_address || '\u2014'}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td className="code-font" style={{ fontSize: '0.725rem', color: '#c084fc', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.hmac}>
                    {l.hmac}
                  </td>
                </tr>
              ))}
            {!loading && logs.length === 0 && !loadError && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '56px 24px' }}>
                  <ShieldCheck size={34} color="#34d399" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
                    No matching audit entries
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto' }}>
                    Every secret creation, reveal, and rotation will be signed into the HMAC-SHA256 audit chain.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
