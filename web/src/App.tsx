import React, { useState, useEffect } from 'react';
import type { Org, User } from './lib/api';
import { apiFetch } from './lib/api';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { SecretsPage } from './pages/SecretsPage';
import { ApiKeysPage } from './pages/ApiKeysPage';
import { AuditPage } from './pages/AuditPage';
import { BillingPage } from './pages/BillingPage';
import { SharePage } from './pages/SharePage';
import { DocsPage } from './pages/DocsPage';

export const App: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [activeTab, setActiveTab] = useState<string>('secrets');
  const [loading, setLoading] = useState(true);

  const path = window.location.pathname;
  const isSharePage = path.startsWith('/share/');
  const shareId = isSharePage ? path.split('/share/')[1] : '';

  useEffect(() => {
    const savedUser = localStorage.getItem('vk_user');
    const savedOrg = localStorage.getItem('vk_org');
    const token = localStorage.getItem('vk_token');

    if (savedUser && savedOrg && token) {
      setUser(JSON.parse(savedUser));
      setOrg(JSON.parse(savedOrg));
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (token: string, u: User, o: Org) => {
    localStorage.setItem('vk_token', token);
    localStorage.setItem('vk_user', JSON.stringify(u));
    localStorage.setItem('vk_org', JSON.stringify(o));
    setUser(u);
    setOrg(o);
    setActiveTab('secrets');
  };

  const handleLock = async () => {
    try {
      await apiFetch('/v1/vault/lock', { method: 'POST' });
    } catch {}
    localStorage.removeItem('vk_token');
    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_org');
    setUser(null);
    setOrg(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#6366f1' }}>
        <div style={{ fontSize: '2rem' }} className="animate-fade">🗝️</div>
      </div>
    );
  }

  if (isSharePage && shareId) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #090d16 60%)' }}>
        <SharePage shareId={shareId} />
      </div>
    );
  }

  if (!user || !org) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #090d16 60%)', padding: '20px' }}>
        <Header user={null} org={null} activeTab={activeTab} setActiveTab={setActiveTab} onLock={handleLock} onLogout={handleLock} />
        {activeTab === 'docs' ? (
          <DocsPage />
        ) : authMode === 'login' ? (
          <Login onSuccess={handleAuthSuccess} onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d16 60%)' }}>
      <Header user={user} org={org} activeTab={activeTab} setActiveTab={setActiveTab} onLock={handleLock} onLogout={handleLock} />
      <main style={{ paddingBottom: '60px' }}>
        {activeTab === 'secrets' && <SecretsPage org={org} />}
        {activeTab === 'keys' && <ApiKeysPage org={org} />}
        {activeTab === 'audit' && <AuditPage />}
        {activeTab === 'billing' && <BillingPage org={org} />}
        {activeTab === 'docs' && <DocsPage />}
      </main>
    </div>
  );
};

export default App;
