import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { PublicShell } from './components/PublicShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastHost } from './components/Toast';
import { PageLoader } from './components/PageLoader';
const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })));
import { MarketingLayout } from './components/landing/MarketingLayout';
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then((module) => ({ default: module.HowItWorksPage })));
const SecurityPage = lazy(() => import('./pages/SecurityPage').then((module) => ({ default: module.SecurityPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then((module) => ({ default: module.PricingPage })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Signup = lazy(() => import('./pages/Signup').then((module) => ({ default: module.Signup })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const SecretsPage = lazy(() => import('./pages/SecretsPage').then((module) => ({ default: module.SecretsPage })));
const ApiKeysPage = lazy(() => import('./pages/ApiKeysPage').then((module) => ({ default: module.ApiKeysPage })));
const AuditPage = lazy(() => import('./pages/AuditPage').then((module) => ({ default: module.AuditPage })));
const BillingPage = lazy(() => import('./pages/BillingPage').then((module) => ({ default: module.BillingPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const SharePage = lazy(() => import('./pages/SharePage').then((module) => ({ default: module.SharePage })));
const AcceptInvitePage = lazy(() => import('./pages/AcceptInvitePage').then((module) => ({ default: module.AcceptInvitePage })));
const DocsPage = lazy(() => import('./pages/DocsPage').then((module) => ({ default: module.DocsPage })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then((module) => ({ default: module.PrivacyPolicy })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((module) => ({ default: module.TermsPage })));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage').then((module) => ({ default: module.RefundPolicyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ForgotPasswordPage />} />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refunds" element={<RefundPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
          </Suspense>
          <ToastHost />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

const SharePageWrapper: React.FC = () => {
  const { shareId = '' } = useParams<{ shareId: string }>();
  return <SharePage key={shareId} shareId={shareId} />;
};

export default App;
