import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { createRazorpaySubscription, verifyRazorpaySubscription } from '../lib/payments';
import { errorMessage } from '../lib/api';
import { openRazorpayCheckout } from '../lib/razorpay';
import { pushToast } from '../lib/toast';
import { useAuth } from '../context/AuthContext';

interface RazorpayCheckoutButtonProps {
  plan: 'pro' | 'enterprise';
  planName: string;
  amountLabel: string;
  isCurrentPlan: boolean;
  onSuccess?: () => void;
}

export const RazorpayCheckoutButton: React.FC<RazorpayCheckoutButtonProps> = ({
  plan,
  planName,
  amountLabel,
  isCurrentPlan,
  onSuccess,
}) => {
  const { user, org, updateOrg } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const subData = await createRazorpaySubscription(plan);

      await openRazorpayCheckout({
        key: subData.key_id,
        subscription_id: subData.subscription_id,
        name: 'VaultKey',
        description: `Subscribe to ${planName} (Recurring)`,
        prefill: {
          email: user?.email || '',
          name: org?.name || '',
        },
        theme: { color: '#3cedeb' },
        handler: (response) => {
          void (async () => {
            try {
              const verifyRes = await verifyRazorpaySubscription({
                razorpay_subscription_id: response.razorpay_subscription_id || subData.subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              });

              if (verifyRes.org) {
                updateOrg(verifyRes.org);
              }
              pushToast(`VaultKey ${planName} auto-renewing subscription activated`, 'success');
              onSuccess?.();
            } catch (err) {
              setError(errorMessage(err, 'Subscription verification failed'));
              pushToast(errorMessage(err, 'Subscription verification failed'), 'error');
            } finally {
              setLoading(false);
            }
          })();
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });
    } catch (err) {
      setError(errorMessage(err, 'Failed to initiate subscription'));
      pushToast(errorMessage(err, 'Failed to initiate subscription'), 'error');
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {error && (
        <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '8px', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={isCurrentPlan || loading}
        onClick={() => void handleSubscribe()}
      >
        {loading ? 'Setting up AutoPay...' : isCurrentPlan ? 'Active Plan' : (<><Zap size={14} /> Subscribe {amountLabel}/mo</>)}
      </button>
    </div>
  );
};
