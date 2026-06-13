import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function GlobalErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-surface max-w-md w-full p-8 rounded-2xl shadow-xl border border-border">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-danger/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-danger" />
          </div>
        </div>
        
        <h1 className="text-2xl font-display font-bold text-text-primary mb-3">
          Something went wrong
        </h1>
        
        <p className="text-text-secondary mb-6 text-sm">
          We apologize, but an unexpected error has occurred. Please try reloading the page.
        </p>

        {error && (
          <div className="bg-background border border-border rounded-lg p-4 mb-6 text-left overflow-x-auto">
            <p className="text-xs font-mono text-danger break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={resetErrorBoundary} 
            icon={RefreshCw}
            className="w-full sm:w-auto"
          >
            Reload Page
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
