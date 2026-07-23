export interface Org {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
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

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  return data as T;
};
