import React from 'react';
import { KeyRound, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PasswordChangeForm } from '../components/settings/PasswordChangeForm';
import { TeamAdminSection } from '../components/settings/TeamAdminSection';
import { isAdminRole } from '../lib/permissions';
import { PageHeader } from '../components/ui/PageHeader';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  return (
    <div className="animate-fade max-w-4xl mx-auto">
      <PageHeader
        title="Settings"
        description="Account security configuration and team access management."
      />

      <div className="glass p-6 mb-5 rounded-xl border border-border">
        <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
          <KeyRound size={16} className="text-primary" /> Account security
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Other active sessions will be signed out.
        </p>
        <PasswordChangeForm />
      </div>

      <div className="glass p-6 rounded-xl border border-border">
        <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
          <Users size={16} className="text-primary" /> Team access
        </h2>
        {isAdmin ? (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              Invite teammates and assign roles.
            </p>
            <TeamAdminSection />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Team management requires an administrator account. Contact an organization admin to make modifications.
          </p>
        )}
      </div>
    </div>
  );
};
