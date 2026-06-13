import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function PageWrapper({ children, title, description, className = '' }) {
  const pageTitle = title ? `${title} | LexIndia` : 'LexIndia — Indian Law Reference Platform';
  const metaDescription = description || 'Simplifying the penal code and making laws accessible to everyone.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
      </Helmet>
      <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full ${className}`}
    >
      {children}
    </motion.div>
    </>
  );
}
