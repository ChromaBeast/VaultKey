import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthCardLayout } from './AuthCardLayout';
import { Button } from '../ui';

export const ResetSuccessView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthCardLayout
      title="All done"
      subtitle="Your password has been reset. You can now sign in to your vault."
      icon={
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 size={24} />
        </div>
      }
    >
      <div className="mt-4">
        <Button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full h-11 font-semibold"
        >
          Proceed to Sign In
        </Button>
      </div>
    </AuthCardLayout>
  );
};
