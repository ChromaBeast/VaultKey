import React, { useState } from 'react';
import { cancelRazorpaySubscription } from '../lib/payments';
import { errorMessage } from '../lib/api';
import { pushToast } from '../lib/toast';
import { useAuth } from '../context/AuthContext';
import { ConfirmDialog } from './ConfirmDialog';

interface CancelSubscriptionButtonProps {
  onSuccess?: () => void;
}

export const CancelSubscriptionButton: React.FC<CancelSubscriptionButtonProps> = ({ onSuccess }) => {
  const { updateOrg } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await cancelRazorpaySubscription();
      if (res.org) {
        updateOrg(res.org);
      }
      pushToast('Auto-renewal has been cancelled', 'success');
      onSuccess?.();
    } catch (err) {
      pushToast(errorMessage(err, 'Failed to cancel subscription'), 'error');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-secondary"
        style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
      >
        {loading ? 'Cancelling...' : 'Cancel Auto-Renewal'}
      </button>
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Cancel auto-renewal?"
        message="Your Pro Team plan stays active until the end of the current billing period, then reverts to the Free tier."
        confirmLabel="Cancel Renewal"
        danger
        loading={loading}
        onConfirm={() => void handleCancel()}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
};
