import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthCardLayout } from './AuthCardLayout';

export const ResetSuccessView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthCardLayout
      title="All done"
      subtitle="Your password has been reset so now you can log in to your account."
      icon={
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--vk-success-dim)',
            border: '1px solid rgba(67, 211, 158, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(67, 211, 158, 0.2)',
          }}
        >
          <CheckCircle2 size={28} color="var(--vk-success)" />
        </div>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="btn btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '11px 24px',
            fontSize: '0.875rem',
          }}
        >
          Log in
        </button>
      </div>
    </AuthCardLayout>
  );
};
