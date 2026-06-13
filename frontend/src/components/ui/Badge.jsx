export default function Badge({ 
  children, 
  variant = 'category',
  className = ''
}) {
  const variants = {
    bailable: "bg-[#E8F5E9] text-success border border-[#C8E6C9]",
    'non-bailable': "bg-[#FDECEA] text-error border border-[#F5C6CB]",
    category: "bg-surface-2 text-text-secondary border border-border",
    admin: "bg-gold/10 text-gold border border-gold",
    role: "bg-info/10 text-info border border-info/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.category} ${className}`}>
      {children}
    </span>
  );
}
