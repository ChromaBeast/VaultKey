import React from 'react';

interface ComparisonDimension {
  feature: string;
  vaultkey: string;
  dotenv: string;
  hashi: string;
}

const COMPARISON_DATA: ComparisonDimension[] = [
  {
    feature: 'Plaintext on disk',
    vaultkey: 'Never — RAM only',
    dotenv: 'Always',
    hashi: 'Temp files / sidecars',
  },
  {
    feature: 'Setup',
    vaultkey: 'Single binary, zero deps',
    dotenv: 'None',
    hashi: 'Cluster + Consul required',
  },
  {
    feature: 'Team sync',
    vaultkey: 'Encrypted (cloud or self-host)',
    dotenv: 'Manual — leaks via Git/Slack',
    hashi: 'Complex IAM policies',
  },
  {
    feature: 'Offline dev',
    vaultkey: 'Full offline support',
    dotenv: 'Yes',
    hashi: 'Requires local server',
  },
  {
    feature: 'Cost',
    vaultkey: 'Free OSS (MIT)',
    dotenv: 'Free',
    hashi: 'BSL / Enterprise pricing',
  },
];

export const ComparisonTable: React.FC = () => {
  return (
    <div
      style={{
        background: 'var(--vk-surface-1)',
        border: '1px solid var(--vk-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--vk-shadow-md)',
        marginBottom: '20px',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--vk-border)', background: 'var(--vk-surface-2)' }}>
              <th style={{ padding: '12px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Capability</th>
              <th style={{ padding: '12px 18px', color: 'var(--vk-accent)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>VaultKey</th>
              <th style={{ padding: '12px 18px', color: 'var(--vk-danger)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Plain .env Files</th>
              <th style={{ padding: '12px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>HashiCorp Vault</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_DATA.map((row) => (
              <tr key={row.feature} style={{ borderBottom: '1px solid var(--vk-border-subtle)' }}>
                <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--vk-text)', fontSize: 'var(--font-size-sm)' }}>
                  {row.feature}
                </td>
                <td style={{ padding: '12px 18px', color: 'var(--vk-accent)', fontWeight: 600, fontSize: 'var(--font-size-sm)', background: 'var(--vk-accent-dim)' }}>
                  {row.vaultkey}
                </td>
                <td style={{ padding: '12px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  {row.dotenv}
                </td>
                <td style={{ padding: '12px 18px', color: 'var(--vk-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  {row.hashi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
