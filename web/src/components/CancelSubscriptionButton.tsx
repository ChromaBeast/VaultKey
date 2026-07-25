import React, { useState } from 'react';
import { cancelRazorpaySubscription } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const CancelSubscriptionButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
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
      alert('Auto-renewal has been cancelled.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription');
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
