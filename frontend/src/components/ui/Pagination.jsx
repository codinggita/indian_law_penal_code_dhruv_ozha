import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Simplified logic for showing pages: just show 5 around current
  let visiblePages = pages;
  if (totalPages > 5) {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);
    if (end === totalPages) {
      start = Math.max(end - 4, 1);
    }
    visiblePages = pages.slice(start - 1, end);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-border text-text-secondary hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 rounded-md border border-border text-sm hover:bg-surface-2">1</button>
          {visiblePages[0] > 2 && <span className="text-text-muted">...</span>}
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border text-sm transition-colors ${
            currentPage === page 
              ? 'bg-primary border-primary text-white' 
              : 'border-border text-text-secondary hover:bg-surface-2'
          }`}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="text-text-muted">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 rounded-md border border-border text-sm hover:bg-surface-2">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-border text-text-secondary hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
