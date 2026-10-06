import React from 'react';
import type { AuditItem } from '../lib/api';
import { TableSkeleton } from './Skeletons';
interface Props { logs: AuditItem[]; loading: boolean; loadError: string | null; }
export const AuditTable: React.FC<Props> = ({ logs, loading, loadError }) => (
      <div className="table-wrap glass audit-table">
        <table>
          <thead>
            <tr><th>ACTION</th><th>SECRET KEY</th><th className="audit-secondary">PROJECT</th><th className="audit-secondary">ACTOR</th><th className="audit-secondary">IP ADDRESS</th><th>TIMESTAMP</th><th className="audit-secondary">HMAC SIGNATURE</th></tr>
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
                    {l.secret_key || 'No secret'}<details className="audit-mobile-details"><summary>Event details</summary><div>Actor: {l.actor || 'Unavailable'}<br />Project: {l.project || 'default'}<br />IP: {l.ip_address || 'Unavailable'}<br /><span className="break-all">Signature: {l.hmac || 'Unavailable'}</span></div></details>
                  </td>
                  <td className="audit-secondary"><span className="badge badge-neutral">{l.project || 'default'}</span></td>
                  <td className="code-font audit-secondary" style={{ fontSize: '0.78rem', color: 'var(--vk-text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.actor || ''}>
                    {l.actor || '—'}
                  </td>
                  <td className="code-font audit-secondary" style={{ color: 'var(--vk-text-muted)', fontSize: '0.78rem' }}>{l.ip_address || '—'}</td>
                  <td style={{ color: 'var(--vk-text-muted)', fontSize: '0.78rem' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td className="code-font audit-secondary" style={{ fontSize: '0.75rem', color: 'var(--vk-accent)', cursor: 'help' }} title={l.hmac}>
                    {l.hmac ? `${l.hmac.slice(0, 8)}…` : '—'}
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
);
