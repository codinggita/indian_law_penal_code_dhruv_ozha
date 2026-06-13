import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Bookmark, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';
import { CATEGORIES } from '../utils/constants';

export default function Landing() {
  const navigate = useNavigate();

  const howItWorks = [
    {
      icon: Search,
      title: 'Search or Browse',
      description: 'Find laws instantly by keyword, section number, or explore by category.',
    },
    {
      icon: BookOpen,
      title: 'Read the Law',
      description: 'View the full section text, punishment details, and court jurisdiction in plain language.',
    },
    {
      icon: Bookmark,
      title: 'Bookmark & Share',
      description: 'Save important laws to your personal profile for quick reference later.',
    }
  ];

  return (
    <PageWrapper className="!px-0 !py-0 w-full max-w-none">
      {/* Hero Section */}
      <section className="relative w-full bg-bg py-24 md:py-32 overflow-hidden border-b border-border">
        {/* Decorative background element */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] text-primary" fill="currentColor">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
            {Array.from({ length: 24 }).map((_, i) => (
              <line 
                key={i} 
                x1="50" y1="50" 
                x2="50" y2="5" 
                stroke="currentColor" 
                strokeWidth="1" 
                transform={`rotate(${i * 15} 50 50)`} 
              />
            ))}
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-text-primary mb-6 tracking-tight leading-tight"
          >
            India's Law, <br className="hidden md:block"/> Made Clear
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto font-body"
          >
            Search, explore, and understand every section of the Indian Penal Code — structured, categorized, and easy to read.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto text-lg" onClick={() => navigate('/laws')}>
              Browse Laws
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg" onClick={() => navigate('/search')}>
              Search a Section
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-surface border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">5,000+</div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Laws Indexed</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">8</div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Major Acts</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">150+</div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-primary mb-1">28</div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface-2 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">A seamless experience designed for legal professionals, students, and citizens.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-surface p-8 rounded-xl shadow-sm border border-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 text-9xl font-display font-bold text-bg opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none select-none">
                    {index + 1}
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-primary mb-3">{step.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">Featured Categories</h2>
              <p className="text-text-secondary">Explore laws by their legal domains.</p>
            </div>
            <button 
              onClick={() => navigate('/laws')}
              className="hidden md:flex items-center text-primary font-medium hover:text-primary-hover transition-colors"
            >
              View All Categories <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 8).map((cat, i) => (
              <button 
                key={cat}
                onClick={() => navigate(`/laws?category=${encodeURIComponent(cat)}`)}
                className="flex items-center p-4 bg-surface-2 border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all text-left border-l-4 border-l-primary"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">
                    {cat.endsWith('Law') ? cat : `${cat} Law`}
                  </h4>
                  <p className="text-xs text-text-muted mt-1">Explore section</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted opacity-50" />
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => navigate('/laws')}
            className="md:hidden mt-8 w-full flex justify-center items-center text-primary font-medium hover:text-primary-hover"
          >
            View All Categories <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#FAFAF7] to-[#F26522]/10 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Start Exploring Indian Law Today
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
            Create a free account to bookmark laws, save your search history, and track legal updates.
          </p>
          <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8">
            Create Free Account
          </Button>
        </div>
      </section>
    </PageWrapper>
  );
}
