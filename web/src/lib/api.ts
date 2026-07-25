export interface Org {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscription_id?: string;
  subscription_status?: string;
  current_period_end?: string;
}

export interface User {
  id: string;
  org_id: string;
  email: string;
  role: string;
}

export interface SecretItem {
  id: string;
  key: string;
  project: string;
  env: string;
  version: number;
  created_by: string;
  updated_at: string;
}

export interface APIKeyItem {
  id: string;
  name: string;
  permissions: string;
  project?: string;
  last_used?: string;
  expires_at?: string;
  created_at: string;
  active: boolean;
}

export interface AuditItem {
  id: string;
  action: string;
  secret_key?: string;
  project?: string;
  actor: string;
  ip_address?: string;
  user_agent?: string;
  hmac: string;
  created_at: string;
}

const getBaseUrl = () => '';

export const AUTH_UNAUTHORIZED_EVENT = 'vk_auth_unauthorized';

export const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('vk_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Clear invalid session state and dispatch global event
    localStorage.removeItem('vk_token');
    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_org');
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  return data as T;
};

export const createRazorpayOrder = async (plan: string, currency = 'INR') => {
  return apiFetch<{ order_id: string; key_id: string; amount: number; currency: string; plan: string }>(
    '/v1/payments/create-order',
    {
      method: 'POST',
      body: JSON.stringify({ plan, currency }),
    }
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
  return apiFetch<{ message: string; org: Org }>('/v1/subscriptions/cancel', {
    method: 'POST',
  });
};

export interface SecretVersionItem {
  id: string;
  version: number;
  created_at: string;
}

export const fetchSecretVersions = async (key: string, project = 'default') => {
  return apiFetch<SecretVersionItem[]>(`/v1/secrets/${key}/versions?project=${project}`);
};

export const rollbackSecretVersion = async (key: string, project: string, version: number) => {
  return apiFetch<{ message: string; version: number }>(`/v1/secrets/${key}/rollback`, {
    method: 'POST',
    body: JSON.stringify({ project, version }),
  });
};



