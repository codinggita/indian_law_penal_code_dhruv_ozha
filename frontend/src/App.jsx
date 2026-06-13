import { Routes, Route } from 'react-router-dom';
import ToastProvider from './components/ui/ToastProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import Landing from './pages/Landing';

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
        <Route path="/login" element={<Placeholder name="Login Page" />} />
        <Route path="/register" element={<Placeholder name="Register Page" />} />
        <Route path="/forgot-password" element={<Placeholder name="Forgot Password" />} />
        <Route path="/reset-password" element={<Placeholder name="Reset Password" />} />
        
        {/* Laws Routes */}
        <Route path="/laws" element={<Placeholder name="Browse Laws" />} />
        <Route path="/laws/:id" element={<Placeholder name="Law Detail" />} />
        <Route path="/search" element={<Placeholder name="Search Laws" />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={<Placeholder name="User Profile" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Placeholder name="Admin Dashboard" />} />
        <Route path="/admin/laws/new" element={<Placeholder name="Add Law" />} />
        <Route path="/admin/laws/:id/edit" element={<Placeholder name="Edit Law" />} />
        <Route path="/admin/users" element={<Placeholder name="Admin Users" />} />
        <Route path="/admin/analytics" element={<Placeholder name="Admin Analytics" />} />
        <Route path="/admin/logs" element={<Placeholder name="System Logs" />} />
        
        {/* Fallback */}
        <Route path="*" element={<Placeholder name="404 Not Found" />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
