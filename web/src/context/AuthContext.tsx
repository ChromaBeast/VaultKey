/* eslint-disable react-refresh/only-export-components -- context module must export provider + hook */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Org, User } from '../lib/api';
import { AUTH_UNAUTHORIZED_EVENT, apiFetch, safeJsonParse } from '../lib/api';
import { clearSessionToken, getSessionToken, setSessionToken } from '../lib/session';

interface AuthContextType {
  user: User | null;
  org: Org | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, org: Org) => void;
  updateOrg: (newOrg: Org) => void;
  logout: () => Promise<void>;
  lockVault: () => Promise<void>;
}

const clearStoredSession = () => {
  clearSessionToken();
  localStorage.removeItem('vk_user');
  localStorage.removeItem('vk_org');
};
interface Session { user: User | null; org: Org | null; token: string | null; }
const readSession = (): Session => {
  const token = getSessionToken();
  const user = safeJsonParse<User>(localStorage.getItem('vk_user'));
  const org = safeJsonParse<Org>(localStorage.getItem('vk_org'));
  if (token && user?.id && user.email && org?.id && org.name) return { user, org, token };
  clearStoredSession();
  return { user: null, org: null, token: null };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ user, org, token }, setSession] = useState<Session>(readSession);
  useEffect(() => {
    const handleUnauthorized = () => setSession({ user: null, org: null, token: null });
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = (newToken: string, newUser: User, newOrg: Org) => {
    setSessionToken(newToken);
    localStorage.setItem('vk_user', JSON.stringify(newUser));
    localStorage.setItem('vk_org', JSON.stringify(newOrg));
    setSession({ token: newToken, user: newUser, org: newOrg });
  };

  const updateOrg = (newOrg: Org) => {
    localStorage.setItem('vk_org', JSON.stringify(newOrg));
    setSession((session) => ({ ...session, org: newOrg }));
  };

  const logout = async () => {
    try {
      await apiFetch('/v1/vault/lock', { method: 'POST' });
    } catch {
      // Locking the vault server-side is best-effort during logout.
    }
    clearStoredSession();
    setSession({ token: null, user: null, org: null });
  };

  const lockVault = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{ user, org, token, loading: false, login, updateOrg, logout, lockVault }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
