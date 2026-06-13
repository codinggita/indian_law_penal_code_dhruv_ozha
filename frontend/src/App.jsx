import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

import ToastProvider from './components/ui/ToastProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Spinner from './components/ui/Spinner';
import GlobalErrorFallback from './components/ui/GlobalErrorFallback';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const LawsList = lazy(() => import('./pages/laws/LawsList'));
const LawDetail = lazy(() => import('./pages/laws/LawDetail'));
const LawSearch = lazy(() => import('./pages/laws/LawSearch'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/user/Profile'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAddLaw = lazy(() => import('./pages/admin/AdminAddLaw'));
const AdminEditLaw = lazy(() => import('./pages/admin/AdminEditLaw'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

function Placeholder({ name }) {
  return (
    <PageWrapper title={name}>
      <div className="p-8 text-2xl font-display text-center bg-surface border border-border rounded-lg shadow-sm">
        {name} View
      </div>
    </PageWrapper>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary fallbackRender={GlobalErrorFallback}>
        <div className="min-h-screen bg-bg flex flex-col text-text-primary">
          <ToastProvider />
          <Navbar />
          
          <main className="flex-1 flex flex-col pt-16">
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center py-32">
                <Spinner size="lg" />
              </div>
            }>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Laws Routes */}
                <Route path="/laws" element={<LawsList />} />
                <Route path="/laws/:id" element={<LawDetail />} />
                <Route path="/search" element={<LawSearch />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="laws/new" element={<AdminAddLaw />} />
                  <Route path="laws/:id/edit" element={<AdminEditLaw />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="analytics" element={<Placeholder name="Admin Analytics" />} />
                  <Route path="logs" element={<Placeholder name="System Logs" />} />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<Placeholder name="404 Not Found" />} />
              </Routes>
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
