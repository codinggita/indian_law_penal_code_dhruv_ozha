import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLaws } from '../../api/laws.api';
import PageWrapper from '../../components/layout/PageWrapper';
import Sidebar from '../../components/layout/Sidebar';
import LawCard from '../../components/shared/LawCard';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';

export default function LawsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for filters that syncs with URL params
  const [filters, setFilters] = useState({
    categories: searchParams.getAll('category'),
    court: searchParams.get('court') || '',
    bailable: searchParams.get('bailable') || '',
    cognizable: searchParams.get('cognizable') || '',
  });

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'title';

  const fetchParams = {
    page,
    limit: 12,
    sort,
    ...(filters.categories.length > 0 && { category: filters.categories.join(',') }),
    ...(filters.court && { court: filters.court }),
    ...(filters.bailable && { bailable: filters.bailable }),
    ...(filters.cognizable && { cognizable: filters.cognizable }),
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['laws', fetchParams],
    queryFn: () => getLaws(fetchParams),
    keepPreviousData: true,
  });

  // Sync state to URL params when applying filters
  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();
    filters.categories.forEach(c => newParams.append('category', c));
    if (filters.court) newParams.set('court', filters.court);
    if (filters.bailable) newParams.set('bailable', filters.bailable);
    if (filters.cognizable) newParams.set('cognizable', filters.cognizable);
    if (sort !== 'title') newParams.set('sort', sort);
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setFilters({ categories: [], court: '', bailable: '', cognizable: '' });
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg">
      {/* Sidebar Filters */}
      <Sidebar 
        mode="laws" 
        filters={filters} 
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <PageWrapper title="Browse Laws">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-text-primary">Browse Indian Laws</h1>
              {data?.data && (
                <p className="text-text-secondary mt-1">
                  Showing {(page - 1) * 12 + 1}–{Math.min(page * 12, data.pagination.total)} of {data.pagination.total} laws
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Sort by:</span>
              <select 
                className="text-sm border-border rounded-md bg-surface text-text-primary focus:ring-primary focus:border-primary py-2 pl-3 pr-8"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-views">Most Viewed</option>
                <option value="title">A–Z</option>
                <option value="-title">Z–A</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <EmptyState 
              title="Error loading laws" 
              description="There was a problem communicating with the server."
              actionText="Try Again"
              onAction={() => refetch()}
            />
          ) : !data?.data || data.data.length === 0 ? (
            <EmptyState 
              title="No laws match your filters" 
              description="Try clearing some filters or searching for something else."
              actionText="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.data.map(law => (
                  <LawCard key={law._id} law={law} />
                ))}
              </div>
              
              {data.pagination && (
                <div className="mt-12">
                  <Pagination 
                    currentPage={page} 
                    totalPages={Math.ceil(data.pagination.total / 12)} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </PageWrapper>
      </div>
    </div>
  );
}
