import React from 'react';

interface ComparisonDimension {
  feature: string;
  vaultkey: string;
  hashi: string;
  cloud: string;
  dotenv: string;
}

const COMPARISON_DATA: ComparisonDimension[] = [
  {
    feature: 'Setup & Footprint',
    vaultkey: '18MB Go binary, zero deps',
    hashi: 'Complex Raft/Consul cluster',
    cloud: 'Cloud account & IAM setup',
    dotenv: 'Zero (unmanaged files)',
  },
  {
    feature: 'Local & Offline Dev',
    vaultkey: 'Full offline RAM injection',
    hashi: 'Heavy local server setup',
    cloud: 'Requires live internet & IAM',
    dotenv: 'Offline, but untracked',
  },
  {
    feature: 'Disk-Free Execution',
    vaultkey: 'RAM-only execve pipeline',
    hashi: 'Agent / Consul template',
    cloud: 'SDK fetch or external sidecar',
    dotenv: 'Plaintext on disk',
  },
  {
    feature: 'Audit Integrity',
    vaultkey: 'HMAC-SHA256 chained ledger',
    hashi: 'Syslog / SIEM integration',
    cloud: 'CloudTrail / Audit logs',
    dotenv: 'Zero visibility',
  },
  {
    feature: 'Licensing & Cost',
    vaultkey: 'Open-source MIT / Free self-host',
    hashi: 'BSL license / High tier pricing',
    cloud: '$0.40/secret/mo + API calls',
    dotenv: 'Free',
  },
];

export const ComparisonTable: React.FC = () => {
  return (
    <div
      style={{
        background: '#090c14',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
        marginBottom: '20px',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '14px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Capability</th>
              <th style={{ padding: '14px 18px', color: 'var(--vk-accent)', fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>VaultKey</th>
              <th style={{ padding: '14px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>HashiCorp Vault</th>
              <th style={{ padding: '14px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>AWS / GCP Secrets</th>
              <th style={{ padding: '14px 18px', color: 'var(--vk-danger)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Plain .env Files</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_DATA.map((row) => (
              <tr key={row.feature} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--vk-text)', fontSize: 'var(--font-size-sm)' }}>
                  {row.feature}
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--vk-accent)', fontWeight: 600, fontSize: 'var(--font-size-sm)', background: 'rgba(60, 237, 235, 0.06)' }}>
                  {row.vaultkey}
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  {row.hashi}
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  {row.cloud}
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  {row.dotenv}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
