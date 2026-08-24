import type { Org } from './api';
import { apiFetch } from './api';

export const createRazorpayOrder = async (plan: string, currency = 'INR') => {
  return apiFetch<{ order_id: string; key_id: string; amount: number; currency: string; plan: string }>(
    '/v1/payments/create-order',
    { method: 'POST', body: JSON.stringify({ plan, currency }) }
  );
};

export const verifyRazorpayPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return apiFetch<{ message: string; status: string; org: Org }>('/v1/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const fetchPaymentHistory = async () => {
  return apiFetch<import('../types/payment').PaymentRecord[]>('/v1/payments/history');
};

export const createRazorpaySubscription = async (plan: string) => {
  return apiFetch<{ subscription_id: string; key_id: string; plan: string }>('/v1/subscriptions/create', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
};

export const verifyRazorpaySubscription = async (payload: {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: string;
}) => {
  return apiFetch<{ message: string; status: string; org: Org }>('/v1/subscriptions/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const cancelRazorpaySubscription = async () => {
  return apiFetch<{ message: string; org: Org }>('/v1/subscriptions/cancel', { method: 'POST' });
};
