import Spinner from './Spinner';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon, 
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover border border-transparent",
    secondary: "bg-surface text-primary hover:bg-surface-2 border border-primary",
    ghost: "bg-transparent text-text-muted hover:text-text-primary hover:bg-surface-2",
    danger: "bg-error text-white hover:bg-red-700 border border-transparent"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="mr-2 text-current" />
      ) : Icon ? (
        <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />
      ) : null}
      {children}
    </button>
  );
}
