/* eslint-disable react-refresh/only-export-components -- context module must export provider + hook */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Org, User } from '../lib/api';
import { AUTH_UNAUTHORIZED_EVENT, apiFetch, safeJsonParse } from '../lib/api';

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

const hasStoredToken = (): boolean => Boolean(localStorage.getItem('vk_token'));

const readStoredUser = (): User | null => {
  const saved = safeJsonParse<User>(localStorage.getItem('vk_user'));
  return hasStoredToken() && saved?.id && saved.email ? saved : null;
};

const readStoredOrg = (): Org | null => {
  const saved = safeJsonParse<Org>(localStorage.getItem('vk_org'));
  return hasStoredToken() && saved?.name ? saved : null;
};

const clearStoredSession = () => {
  localStorage.removeItem('vk_token');
  localStorage.removeItem('vk_user');
  localStorage.removeItem('vk_org');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [org, setOrg] = useState<Org | null>(readStoredOrg);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vk_token'));

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setOrg(null);
      setToken(null);
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  // Corrupt or partial persisted sessions hydrate as logged-out; drop the stale keys.
  if (!(user && org && token)) {
    clearStoredSession();
  }

  const login = (newToken: string, newUser: User, newOrg: Org) => {
    localStorage.setItem('vk_token', newToken);
    localStorage.setItem('vk_user', JSON.stringify(newUser));
    localStorage.setItem('vk_org', JSON.stringify(newOrg));
    setToken(newToken);
    setUser(newUser);
    setOrg(newOrg);
  };

  const updateOrg = (newOrg: Org) => {
    localStorage.setItem('vk_org', JSON.stringify(newOrg));
    setOrg(newOrg);
  };

  const logout = async () => {
    try {
      await apiFetch('/v1/vault/lock', { method: 'POST' });
    } catch {
      // Locking the vault server-side is best-effort during logout.
    }
    clearStoredSession();
    setToken(null);
    setUser(null);
    setOrg(null);
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
