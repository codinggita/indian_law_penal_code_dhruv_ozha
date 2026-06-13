import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  helper, 
  icon: Icon, 
  className = '', 
  id,
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-muted" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-md border text-text-primary bg-surface shadow-sm
            focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm
            disabled:bg-surface-2 disabled:text-text-muted disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-error text-error focus:ring-error focus:border-error' : 'border-border'}
            px-3 py-2
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-text-muted">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
