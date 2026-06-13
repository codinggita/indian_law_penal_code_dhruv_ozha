import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, User, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../ui/ThemeProvider';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, role, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-30 transition-all duration-200 ${isScrolled ? 'bg-surface shadow-sm border-b border-border' : 'bg-surface border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="LexIndia Logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-2xl text-text-primary tracking-tight">LexIndia</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-text-secondary hover:text-primary transition-colors px-1 py-2 font-medium text-sm">
                Home
              </Link>
              <Link to="/laws" className="text-text-secondary hover:text-primary transition-colors px-1 py-2 font-medium text-sm">
                Browse Laws
              </Link>
              <Link to="/search" className="text-text-secondary hover:text-primary transition-colors px-1 py-2 font-medium text-sm">
                Search
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-2"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="primary" onClick={() => navigate('/register')}>Register</Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1">
                    <Badge variant="admin">Admin Dashboard</Badge>
                  </Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 bg-surface-2 p-1 rounded-full border border-border hover:border-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  </button>

                  {isProfileDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-border z-50 py-1">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-primary"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-2"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-primary p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border shadow-sm absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-2">Home</Link>
            <Link to="/laws" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-2">Browse Laws</Link>
            <Link to="/search" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-2">Search</Link>
            
            {!isAuthenticated ? (
              <div className="mt-4 flex flex-col space-y-2 px-3">
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="primary" className="justify-start" onClick={() => navigate('/register')}>Register</Button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-border">
                {role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gold hover:bg-surface-2">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-2">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-surface-2"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
