import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Org, User } from '../lib/api';
import { AUTH_UNAUTHORIZED_EVENT, apiFetch } from '../lib/api';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('vk_user');
    const savedOrg = localStorage.getItem('vk_org');
    const savedToken = localStorage.getItem('vk_token');

    if (savedUser && savedOrg && savedToken) {
      setUser(JSON.parse(savedUser));
      setOrg(JSON.parse(savedOrg));
      setToken(savedToken);
    }
    setLoading(false);

    // Global listener for 401 Unauthorized token expirations
    const handleUnauthorized = () => {
      setUser(null);
      setOrg(null);
      setToken(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

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
    } catch {}
    localStorage.removeItem('vk_token');
    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_org');
    setToken(null);
    setUser(null);
    setOrg(null);
  };

  const lockVault = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, org, token, loading, login, updateOrg, logout, lockVault }}>
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
