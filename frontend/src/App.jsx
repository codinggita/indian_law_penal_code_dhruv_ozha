import { Routes, Route } from 'react-router-dom';
import ToastProvider from './components/ui/ToastProvider';

function Placeholder({ name }) {
  return <div className="p-8 text-2xl font-display">{name}</div>;
}

function App() {
  return (
    <div className="min-h-screen bg-bg">
      <ToastProvider />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Placeholder name="Landing Page" />} />
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
    </div>
  );
}

export default App;
