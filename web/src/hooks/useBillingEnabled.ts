import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

// Billing is on once the server has all five RAZORPAY_* values. Until the
// public config loads (or if it fails), treat billing as off.
export const useBillingEnabled = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch<{ billing_enabled?: boolean }>('/v1/auth/config')
      .then((config) => { if (active) setEnabled(Boolean(config.billing_enabled)); })
      .catch(() => { if (active) setEnabled(false); });
    return () => { active = false; };
  }, []);

  return enabled;
};
