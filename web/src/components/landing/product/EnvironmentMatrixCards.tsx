import React, { useState } from 'react';

interface EnvironmentData {
  id: string;
  name: string;
  secretsCount: number;
  membersCount: number;
  serviceTokens: number;
  status: string;
  badgeColor: string;
  description: string;
  allowedRoles: string[];
}

const ENVIRONMENTS: EnvironmentData[] = [
  {
    id: 'development',
    name: 'Development',
    secretsCount: 42,
    membersCount: 4,
    serviceTokens: 2,
    status: 'Auto-Sync Active',
    badgeColor: '#5ee7ff',
    description: 'Local development environment. Developers can read, create, and test secrets locally without affecting production.',
    allowedRoles: ['Developers (Read/Write)', 'Local CLI (Test)'],
  },
  {
    id: 'staging',
    name: 'Staging',
    secretsCount: 38,
    membersCount: 4,
    serviceTokens: 3,
    status: 'CI/CD Connected',
    badgeColor: '#818cf8',
    description: 'Pre-production testing cluster. Scoped tokens inject secrets during automated preview branch builds.',
    allowedRoles: ['Developers (Read)', 'GitHub Actions (Read)', 'DevOps (Admin)'],
  },
  {
    id: 'production',
    name: 'Production',
    secretsCount: 51,
    membersCount: 2,
    serviceTokens: 4,
    status: 'Strict Access Enforced',
    badgeColor: '#10b981',
    description: 'Mission-critical cloud workloads. Read access strictly limited to verified production servers with mandatory audit logging.',
    allowedRoles: ['Security Admins (Admin)', 'Production Cluster (Read-Only)'],
  },
];

export const EnvironmentMatrixCards: React.FC = () => {
  const [activeEnv, setActiveEnv] = useState<string>('production');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {ENVIRONMENTS.map((env) => {
        const isSelected = activeEnv === env.id;
        return (
          <div
            key={env.id}
            onClick={() => setActiveEnv(env.id)}
            className={isSelected ? 'glass-glow' : 'glass'}
            style={{
              padding: '24px',
              borderRadius: '16px',
              cursor: 'pointer',
              border: isSelected
                ? `1px solid ${env.badgeColor}`
                : '1px solid rgba(255, 255, 255, 0.08)',
              background: isSelected ? 'rgba(14, 18, 27, 0.95)' : 'rgba(14, 18, 27, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f5f7fa' }}>
                  {env.name}
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: `${env.badgeColor}15`,
                    color: env.badgeColor,
                    border: `1px solid ${env.badgeColor}35`,
                  }}
                >
                  {env.status}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '12px 14px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f5f7fa' }}>
                    {env.secretsCount}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#8b93a3', textTransform: 'uppercase' }}>
                    Secrets
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f5f7fa' }}>
                    {env.membersCount}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#8b93a3', textTransform: 'uppercase' }}>
                    Members
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f5f7fa' }}>
                    {env.serviceTokens}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#8b93a3', textTransform: 'uppercase' }}>
                    Tokens
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.825rem', color: '#8b93a3', lineHeight: 1.55, marginBottom: '16px' }}>
                {env.description}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px' }}>
                Authorized Principals:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {env.allowedRoles.map((role) => (
                  <div
                    key={role}
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: env.badgeColor }}>•</span>
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
