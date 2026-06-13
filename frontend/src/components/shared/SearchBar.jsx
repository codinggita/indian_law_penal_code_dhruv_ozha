import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ initialQuery = '', onSearch }) {
  const [query, setQuery] = useState(initialQuery);

  // Update internal state if props change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Debounce the search callback
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-6 w-6 text-text-muted" />
      </div>
      <input
        type="text"
        className="block w-full rounded-xl border-border bg-surface text-text-primary pl-12 pr-12 py-4 text-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder-text-muted"
        placeholder="Search by title, section, or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
