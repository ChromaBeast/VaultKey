import React from 'react';
import { KeyRound, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PasswordChangeForm } from '../components/settings/PasswordChangeForm';
import { TeamAdminSection } from '../components/settings/TeamAdminSection';

export const SettingsPage: React.FC = () => {
  return (
    <div className="animate-fade" style={{ maxWidth: '860px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Settings</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' }}>
          Account security and team access management
        </p>
      </div>

      <div className="glass" style={{ padding: '28px', borderRadius: '16px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '9px' }}>
          <KeyRound size={17} color="#c084fc" /> Account Password
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
          Changing your password re-derives your key material; other sessions may be invalidated.
        </p>
        <PasswordChangeForm />
      </div>

      <TeamSection />
    </div>
  );
};

const TeamSection: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="glass" style={{ padding: '28px', borderRadius: '16px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '9px' }}>
        <Users size={17} color="#818cf8" /> Team
      </h2>
      {isAdmin ? (
        <>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
            Invite teammates and manage their roles. Share the initial password through a secure channel.
          </p>
          <TeamAdminSection />
        </>
      ) : (
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Team management requires an administrator account. Ask an admin of your organization to make changes.
        </p>
      )}
    </div>
  );
};
