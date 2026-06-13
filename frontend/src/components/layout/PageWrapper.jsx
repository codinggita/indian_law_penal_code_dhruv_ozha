import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PageWrapper({ children, title, className = '' }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | LexIndia`;
    } else {
      document.title = 'LexIndia — Indian Law Reference Platform';
    }
  }, [title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
