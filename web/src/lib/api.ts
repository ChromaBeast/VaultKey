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
  actor?: string;
  ip_address?: string;
  user_agent?: string;
  hmac: string;
  prev_hmac?: string;
  created_at: string;
}

export interface TeamUser {
  id: string;
  email: string;
  role: 'admin' | 'write' | 'read' | string;
  created_at?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const errorMessage = (err: unknown, fallback = 'Request failed'): string => {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

export const isAbortError = (err: unknown): boolean =>
  err instanceof Error && err.name === 'AbortError';

export const encodePath = (segment: string): string => encodeURIComponent(segment);

export const buildQuery = (params: Record<string, string | number | undefined>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const AUTH_UNAUTHORIZED_EVENT = 'vk_auth_unauthorized';

export const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('vk_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(path, { ...options, headers });
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new ApiError('Network request failed. Check your connection and try again.', 0);
  }

  if (res.status === 401) {
    localStorage.removeItem('vk_token');
    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_org');
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    throw new ApiError('Session expired. Please log in again.', 401);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(`Unexpected server response (HTTP ${res.status})`, res.status);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ApiError(`Malformed server response (HTTP ${res.status})`, res.status);
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error || `Request failed with HTTP ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
};

export interface SecretVersionItem {
  id: string;
  version: number;
  created_at: string;
}

export const fetchSecrets = (project: string, signal?: AbortSignal) =>
  apiFetch<SecretItem[]>(`/v1/secrets${buildQuery({ project })}`, { signal });

export const fetchProjects = (signal?: AbortSignal) => apiFetch<string[]>('/v1/projects', { signal });

export const createSecret = (key: string, value: string, project: string) =>
  apiFetch<{ message?: string }>('/v1/secrets', {
    method: 'POST',
    body: JSON.stringify({ key, value, project }),
  });

export const revealSecretValue = (key: string, project: string) =>
  apiFetch<{ value: string }>(`/v1/secrets/${encodePath(key)}${buildQuery({ project })}`);

export const updateSecretValue = (key: string, value: string, project: string) =>
  apiFetch<{ message?: string }>(`/v1/secrets/${encodePath(key)}${buildQuery({ project })}`, {
    method: 'PUT',
    body: JSON.stringify({ value, project }),
  });

export const deleteSecret = (key: string, project: string) =>
  apiFetch<void>(`/v1/secrets/${encodePath(key)}${buildQuery({ project })}`, { method: 'DELETE' });

export const fetchSecretVersions = (key: string, project = 'default') =>
  apiFetch<SecretVersionItem[]>(
    `/v1/secrets/${encodePath(key)}/versions${buildQuery({ project })}`
  );

export type RollbackParams = {
  project: string;
  environment?: string;
  version: number;
};

export const rollbackSecretVersion = (key: string, params: RollbackParams) =>
  apiFetch<{ message?: string; version?: number }>(
    `/v1/secrets/${encodePath(key)}/rollback${buildQuery(params)}`,
    { method: 'POST' }
  );
export * from './api_team';

