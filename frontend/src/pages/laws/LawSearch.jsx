import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchLaws } from '../../api/search.api';
import PageWrapper from '../../components/layout/PageWrapper';
import Sidebar from '../../components/layout/Sidebar';
import LawCard from '../../components/shared/LawCard';
import SearchBar from '../../components/shared/SearchBar';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';

const POPULAR_SEARCHES = ['Murder', 'Theft', 'Fraud', 'Divorce', 'Cyber Crime', 'Defamation'];

export default function LawSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState(() => {
    if (searchParams.getAll('category').length > 0 || searchParams.get('court') || searchParams.get('bailable') || searchParams.get('cognizable')) {
      return {
        categories: searchParams.getAll('category'),
        court: searchParams.get('court') || '',
        bailable: searchParams.get('bailable') || '',
        cognizable: searchParams.get('cognizable') || '',
      };
    }
    try {
      const stored = sessionStorage.getItem('lawSearchFilters');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return { categories: [], court: '', bailable: '', cognizable: '' };
  });

  useEffect(() => {
    sessionStorage.setItem('lawSearchFilters', JSON.stringify(filters));
  }, [filters]);

  const page = parseInt(searchParams.get('page') || '1', 10);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches')) || [];
    } catch {
      return [];
    }
  });

  const fetchParams = {
    q: initialQuery,
    page,
    limit: 12,
    ...(filters.categories.length > 0 && { category: filters.categories.join(',') }),
    ...(filters.court && { court: filters.court }),
    ...(filters.bailable && { bailable: filters.bailable }),
    ...(filters.cognizable && { cognizable: filters.cognizable }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['search', fetchParams],
    queryFn: () => searchLaws(fetchParams),
    enabled: initialQuery.length > 0, // Only fetch if there is a query
    keepPreviousData: true,
  });

  const handleSearch = (newQuery) => {
    const newParams = new URLSearchParams(searchParams);
    if (newQuery) {
      newParams.set('q', newQuery);
      newParams.set('page', '1');
      
      // Save to recent searches
      const updatedSearches = [newQuery, ...recentSearches.filter(q => q !== newQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();
    if (initialQuery) newParams.set('q', initialQuery);
    filters.categories.forEach(c => newParams.append('category', c));
    if (filters.court) newParams.set('court', filters.court);
    if (filters.bailable) newParams.set('bailable', filters.bailable);
    if (filters.cognizable) newParams.set('cognizable', filters.cognizable);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setFilters({ categories: [], court: '', bailable: '', cognizable: '' });
    const newParams = new URLSearchParams();
    if (initialQuery) newParams.set('q', initialQuery);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg">
      <Sidebar 
        mode="laws" 
        filters={filters} 
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="flex-1 w-full flex flex-col">
        {/* Search Hero */}
        <div className="bg-surface border-b border-border py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-text-primary mb-6">Search Legal Records</h1>
            <SearchBar initialQuery={initialQuery} onSearch={handleSearch} />
          </div>
        </div>

        <PageWrapper className="flex-1">
          {!initialQuery ? (
            <div className="max-w-4xl mx-auto py-8">
              <div className="mb-12">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map(term => (
                    <button 
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-4 py-2 bg-surface rounded-full border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(term => (
                      <button 
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-surface-2 rounded-full border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-display text-text-primary">
                  {data?.pagination?.total !== undefined ? (
                    <>
                      <span className="font-bold text-primary">{data.pagination.total}</span> results found for "{initialQuery}"
                    </>
                  ) : (
                    <>Searching for "{initialQuery}"...</>
                  )}
                </h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : isError ? (
                <EmptyState 
                  title="Search failed" 
                  description="We encountered an error while searching. Please try again."
                  actionText="Retry"
                  onAction={() => refetch()}
                />
              ) : !data?.data || data.data.length === 0 ? (
                <EmptyState 
                  title="No matches found" 
                  description={`We couldn't find any laws matching "${initialQuery}". Try using different keywords or clearing your filters.`}
                  actionText="Clear Filters"
                  onAction={handleClearFilters}
                />
              ) : (
                <div className="space-y-4 flex flex-col">
                  {data.data.map(law => (
                    <LawCard key={law._id} law={law} />
                  ))}
                  
                  {data.pagination && (
                    <div className="mt-8">
                      <Pagination 
                        currentPage={page} 
                        totalPages={Math.ceil(data.pagination.total / 12)} 
                        onPageChange={handlePageChange} 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </PageWrapper>
      </div>
    </div>
  );
}
