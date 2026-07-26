import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { SecretsPage } from './pages/SecretsPage';
import { ApiKeysPage } from './pages/ApiKeysPage';
import { AuditPage } from './pages/AuditPage';
import { BillingPage } from './pages/BillingPage';
import { SharePage } from './pages/SharePage';
import { DocsPage } from './pages/DocsPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/share/:shareId" element={<SharePageWrapper />} />

          {/* Protected Application Routes (wrapped in AppLayout) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/secrets" element={<SecretsPage />} />
            <Route path="/keys" element={<ApiKeysPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const SharePageWrapper: React.FC = () => {
  const { shareId = '' } = useParams<{ shareId: string }>();
  return (
    <div style={{ minHeight: '100vh', background: '#0b0e14', padding: '20px' }}>
      <SharePage shareId={shareId} />
    </div>
  );
};

export default App;
