import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { PublicShell } from './components/PublicShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastHost } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SecretsPage } from './pages/SecretsPage';
import { ApiKeysPage } from './pages/ApiKeysPage';
import { AuditPage } from './pages/AuditPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';
import { SharePage } from './pages/SharePage';
import { AcceptInvitePage } from './pages/AcceptInvitePage';
import { DocsPage } from './pages/DocsPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ForgotPasswordPage />} />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/share/:shareId" element={<SharePageWrapper />} />
            <Route path="/docs" element={<PublicShell><DocsPage /></PublicShell>} />

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
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastHost />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

const SharePageWrapper: React.FC = () => {
  const { shareId = '' } = useParams<{ shareId: string }>();
  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <SharePage shareId={shareId} />
    </div>
  );
};

export default App;
