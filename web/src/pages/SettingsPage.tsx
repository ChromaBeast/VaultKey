import React from 'react';
import { Lock, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PasswordChangeForm } from '../components/settings/PasswordChangeForm';
import { TeamAdminSection } from '../components/settings/TeamAdminSection';
import { isAdminRole } from '../lib/permissions';
import { PageHeader } from '../components/ui/PageHeader';
import { IconTile } from '../components/ui/IconTile';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  return (
    <div className="animate-fade max-w-5xl mx-auto">
      <PageHeader
        title="Settings" icon={<Settings size={20} />} tone="amber"
        description="Account security configuration and team access management."
      />

      <div className="settings-layout">
        <section className="glass settings-card" aria-labelledby="security-title">
          <header>
            <IconTile tone="cyan"><Lock size={20} /></IconTile>
            <div>
              <h2 id="security-title">Change password</h2>
              <p>Other active sessions will be signed out.</p>
            </div>
          </header>
          <PasswordChangeForm />
        </section>

        {isAdmin ? <TeamAdminSection /> : (
          <section className="glass settings-card" aria-label="Team access">
            <p className="text-sm text-muted-foreground">
              Team management requires an administrator account. Contact an organization admin to make modifications.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
