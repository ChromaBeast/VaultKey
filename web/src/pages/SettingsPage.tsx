import React from 'react';
import { KeyRound, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PasswordChangeForm } from '../components/settings/PasswordChangeForm';
import { TeamAdminSection } from '../components/settings/TeamAdminSection';
import { PageHeader } from '../components/ui/PageHeader';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="animate-fade" style={{ maxWidth: '880px', margin: '0 auto' }}>
      <PageHeader
        breadcrumb="ORGANIZATION"
        title="Settings & Access"
        description="Account security configuration and team access management."
      />

      <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--vk-text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <KeyRound size={16} color="var(--vk-accent)" /> Account Security & Password
        </h2>
        <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem', marginBottom: '18px' }}>
          Changing your password re-derives your Argon2id key material; other active sessions will be invalidated.
        </p>
        <PasswordChangeForm />
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--vk-text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="var(--vk-accent-secondary)" /> Team Members & Roles
        </h2>
        {isAdmin ? (
          <>
            <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.825rem', marginBottom: '18px' }}>
              Invite teammates and assign roles. Teammates configure their own zero-knowledge passwords upon accepting.
            </p>
            <TeamAdminSection />
          </>
        ) : (
          <p style={{ color: 'var(--vk-text-muted)', fontSize: '0.85rem' }}>
            Team management requires an administrator account. Contact an organization admin to make modifications.
          </p>
        )}
      </div>
    </div>
  );
};
