import React, { useState } from 'react';
import type { AuditItem } from '../lib/api';
import { TableSkeleton } from './Skeletons';
import { copyText } from '../hooks/useClipboard';
import { pushToast } from '../lib/toast';

interface Props { logs: AuditItem[]; loading: boolean; loadError: string | null; }

export const AuditTable: React.FC<Props> = ({ logs, loading, loadError }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHmac = (id: string, hmac: string) => {
    void copyText(hmac).then((ok) => {
      if (ok) {
        setCopiedId(id);
        pushToast('HMAC signature copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
      }
    });
  };

  return (
    <div className="table-wrap glass audit-table" aria-busy={loading}>
      <table className="w-full">
        <thead>
          <tr>
            <th>ACTION</th>
            <th>SECRET KEY</th>
            <th className="audit-secondary">PROJECT</th>
            <th className="audit-secondary">ACTOR</th>
            <th className="audit-secondary">IP ADDRESS</th>
            <th>TIMESTAMP</th>
            <th className="audit-secondary">HMAC SIGNATURE</th>
          </tr>
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
                <td className="code-font font-semibold text-foreground max-w-[170px] truncate" title={l.secret_key || '-'}>
                  {l.secret_key || 'No secret'}
                  <details className="secret-mobile-details"><summary>Event details</summary><div>Actor: {l.actor || 'Unavailable'}<br />Project: {l.project || 'default'}<br />IP: {l.ip_address || 'Unavailable'}<br /><span className="break-all">Signature: {l.hmac || 'Unavailable'}</span></div></details>
                </td>
                <td className="audit-secondary"><span className="text-xs text-muted-foreground">{l.project || 'default'}</span></td>
                <td className="code-font audit-secondary text-xs text-muted-foreground max-w-[150px] truncate" title={l.actor || ''}>
                  {l.actor || '-'}
                </td>
                <td className="code-font audit-secondary text-muted-foreground text-xs">{l.ip_address || '-'}</td>
                <td className="text-muted-foreground text-xs">{new Date(l.created_at).toLocaleString()}</td>
                <td className="code-font audit-secondary text-xs">
                  {l.hmac ? (
                    <button
                      type="button"
                      onClick={() => handleCopyHmac(l.id, l.hmac)}
                      className="text-primary hover:text-primary-hover font-mono cursor-pointer transition-colors"
                      title={`Click to copy full HMAC: ${l.hmac}`}
                    >
                      {copiedId === l.id ? 'Copied!' : `${l.hmac.slice(0, 8)}…`}
                    </button>
                  ) : '-'}
                </td>
              </tr>
            ))}
          {!loading && logs.length === 0 && !loadError && (
            <tr>
              <td colSpan={7} className="text-center py-12 px-6 text-muted-foreground text-sm">
                No matching audit entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
