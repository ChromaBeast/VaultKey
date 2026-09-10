import { apiFetch, encodePath } from './api';
import type { TeamUser, User, Org } from './api';

export interface InviteResponse {
  token: string;
  invite_url: string;
  email: string;
  role: string;
  expires_at: string;
}

export interface InviteDetails {
  token: string;
  email: string;
  role: string;
  org_name: string;
  expires_at: string;
}

export interface AcceptInviteResponse {
  status: string;
  token?: string;
  user: User;
  org?: Org;
}

export const fetchUsers = () => apiFetch<TeamUser[]>('/v1/users');

export const inviteUser = (payload: { email: string; role: string }) =>
  apiFetch<InviteResponse>('/v1/users/invite', { method: 'POST', body: JSON.stringify(payload) });

export const deleteUser = (id: string) =>
  apiFetch<void>(`/v1/users/${encodePath(id)}`, { method: 'DELETE' });

export const fetchInviteDetails = (token: string, signal?: AbortSignal) =>
  apiFetch<InviteDetails>(`/v1/invites/details?token=${encodeURIComponent(token)}`, { signal });

export const acceptInvite = (token: string, password: string) =>
  apiFetch<AcceptInviteResponse>('/v1/auth/accept-invite', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });

export const changePassword = (current_password: string, new_password: string) =>
  apiFetch<Record<string, never>>('/v1/account/password', {
    method: 'POST',
    body: JSON.stringify({ current_password, new_password }),
  });

export const createShareLink = (value: string) =>
  apiFetch<{ share_url: string }>('/v1/shares', {
    method: 'POST',
    body: JSON.stringify({ secret: value, max_views: 1, duration: '24h' }),
  });

export const fetchSharedSecret = (shareId: string, signal?: AbortSignal) =>
  apiFetch<{ secret: string }>(`/v1/shares/${encodePath(shareId)}`, { signal });

