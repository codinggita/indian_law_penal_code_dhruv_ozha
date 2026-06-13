import { Routes, Route } from 'react-router-dom';
import ToastProvider from './components/ui/ToastProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import LawsList from './pages/laws/LawsList';
import LawDetail from './pages/laws/LawDetail';
import LawSearch from './pages/laws/LawSearch';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/user/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAddLaw from './pages/admin/AdminAddLaw';
import AdminEditLaw from './pages/admin/AdminEditLaw';
import AdminUsers from './pages/admin/AdminUsers';

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
    <div className="min-h-screen bg-bg flex flex-col">
      <ToastProvider />
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-16">
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
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
