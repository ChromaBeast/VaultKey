import React, { useState, useEffect } from 'react';
import type { AuditItem } from '../lib/api';
import { apiFetch } from '../lib/api';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    try {
      setLoading(true);
      const list = await apiFetch<AuditItem[]>('/v1/audit?limit=50');
      setLogs(list || []);
      const vRes = await apiFetch<{ verified: boolean }>('/v1/audit/verify');
      setVerified(vRes.verified);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAudit(); }, []);

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tamper-Evident Audit Ledger</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>HMAC-SHA256 chained audit entries guarantee ledger integrity</p>
        </div>
        {verified !== null && (
          <div style={{ padding: '8px 16px', borderRadius: '999px', background: verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: '1px solid ' + (verified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'), color: verified ? '#10b981' : '#f87171', fontWeight: 600, fontSize: '0.85rem' }}>
            {verified ? '✓ HMAC Chain Cryptographically Verified' : '⚠️ Tamper Detected in HMAC Chain!'}
          </div>
        )}
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>ACTION</th><th>SECRET KEY</th><th>PROJECT</th><th>ACTOR</th><th>IP ADDRESS</th><th>TIMESTAMP</th><th>HMAC SIGNATURE</th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>
                  <span className={`badge badge-${l.action === 'WRITE' ? 'write' : l.action === 'READ' ? 'read' : 'admin'}`}>
                    {l.action}
                  </span>
                </td>
                <td className="code-font">{l.secret_key || '-'}</td>
                <td>{l.project || 'default'}</td>
                <td className="code-font" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{l.actor}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{l.ip_address || '127.0.0.1'}</td>
                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(l.created_at).toLocaleString()}</td>
                <td className="code-font" style={{ fontSize: '0.7rem', color: '#6366f1', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.hmac}>
                  {l.hmac}
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>No audit entries logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
