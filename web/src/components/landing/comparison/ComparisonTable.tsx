import React from 'react';

const COMPARISON_ROWS = [
  { feature: 'Centralized Source of Truth', env: '❌ Scattered across machines', vk: '✓ Single encrypted vault' },
  { feature: 'Granular Access Controls', env: '❌ All-or-nothing file sharing', vk: '✓ Scoped roles & machine tokens' },
  { feature: 'Audit & Access History', env: '❌ Zero visibility into reads', vk: '✓ Chained HMAC-SHA256 ledger' },
  { feature: 'Secret Versioning & Rollback', env: '❌ Manual overwrites', vk: '✓ 1-Click version rollback' },
  { feature: 'Zero Plaintext on Disk', env: '❌ Stored as plaintext files', vk: '✓ Injected directly into RAM' },
  { feature: 'Instant Credential Revocation', env: '❌ Manually message every dev', vk: '✓ Revoke token in 1 click' },
  { feature: 'CI/CD & Server Automation', env: '❌ Fragile copy-pasting', vk: '✓ Single command injection' },
];

export const ComparisonTable: React.FC = () => {
  return (
    <div
      style={{
        background: '#090c14',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
        marginBottom: '40px',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '16px 20px', color: '#8b93a3' }}>Core Capability</th>
              <th style={{ padding: '16px 20px', color: '#f87171' }}>Legacy .env Files</th>
              <th style={{ padding: '16px 20px', color: '#5ee7ff' }}>VaultKey Engine</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f5f7fa' }}>
                  {row.feature}
                </td>
                <td style={{ padding: '14px 20px', color: '#8b93a3', fontSize: '0.82rem' }}>
                  {row.env}
                </td>
                <td style={{ padding: '14px 20px', color: '#5ee7ff', fontWeight: 500, fontSize: '0.82rem' }}>
                  {row.vk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
