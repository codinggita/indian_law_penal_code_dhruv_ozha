import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-2 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-xl text-text-primary">LexIndia</span>
            </Link>
            <p className="text-text-secondary text-sm">
              India's comprehensive, easy-to-use legal reference platform. Simplifying the penal code and making laws accessible to everyone.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary mb-4 tracking-wider uppercase text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/laws" className="text-text-secondary hover:text-primary transition-colors">Browse Laws</Link></li>
              <li><Link to="/search" className="text-text-secondary hover:text-primary transition-colors">Search</Link></li>
              <li><Link to="/register" className="text-text-secondary hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="text-text-secondary hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4 tracking-wider uppercase text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><button className="hover:text-primary transition-colors text-left">Terms of Service</button></li>
              <li><button className="hover:text-primary transition-colors text-left">Privacy Policy</button></li>
              <li><button className="hover:text-primary transition-colors text-left">Disclaimer</button></li>
              <li><button className="hover:text-primary transition-colors text-left">Contact Us</button></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} LexIndia — Indian Law Reference Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
