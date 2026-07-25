import React, { useState } from 'react';
import { cancelRazorpaySubscription } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface CancelSubscriptionButtonProps {
  onSuccess?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error') => void;
}

export const CancelSubscriptionButton: React.FC<CancelSubscriptionButtonProps> = ({ onSuccess, onShowToast }) => {
  const { updateOrg } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel auto-renewal for your subscription?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await cancelRazorpaySubscription();
      if (res.org) {
        updateOrg(res.org);
      }
      if (onShowToast) {
        onShowToast('Auto-renewal has been cancelled.', 'success');
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (onShowToast) {
        onShowToast(err.message || 'Failed to cancel subscription', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? 'Cancelling...' : 'Cancel Auto-Renewal'}
    </button>
  );
};
