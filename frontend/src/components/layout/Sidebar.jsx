import { NavLink } from 'react-router-dom';
import { CATEGORIES, COURTS } from '../../utils/constants';
import Button from '../ui/Button';

export default function Sidebar({ mode = 'laws', filters = {}, setFilters = () => {}, onApply = () => {}, onClear = () => {} }) {
  
  if (mode === 'admin') {
    const adminLinks = [
      { name: 'Dashboard', path: '/admin', end: true },
      { name: 'All Laws', path: '/admin/laws' },
      { name: 'Add Law', path: '/admin/laws/new' },
      { name: 'Users', path: '/admin/users' },
      { name: 'Analytics', path: '/admin/analytics' },
      { name: 'System Logs', path: '/admin/logs' },
    ];

    return (
      <aside className="w-64 bg-surface-2 min-h-[calc(100vh-4rem)] border-r border-border p-6 flex-shrink-0">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Admin Panel</h2>
        <nav className="space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary border-l-4 border-transparent'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }

  // Laws Browse Filter Mode
  return (
    <aside className="w-72 bg-surface-2 min-h-[calc(100vh-4rem)] border-r border-border p-6 flex-shrink-0 overflow-y-auto hidden lg:block">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-text-primary">Filters</h2>
        <button onClick={onClear} className="text-sm text-text-muted hover:text-primary transition-colors">
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category)}
                  onChange={(e) => {
                    const newCats = e.target.checked 
                      ? [...(filters.categories || []), category]
                      : (filters.categories || []).filter(c => c !== category);
                    setFilters({ ...filters, categories: newCats });
                  }}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="ml-2 text-sm text-text-secondary">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bailable / Cognizable */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Attributes</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Bailable</span>
              <select 
                className="text-sm border-border rounded-md bg-surface text-text-primary focus:ring-primary focus:border-primary"
                value={filters.bailable || ''}
                onChange={e => setFilters({ ...filters, bailable: e.target.value })}
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Cognizable</span>
              <select 
                className="text-sm border-border rounded-md bg-surface text-text-primary focus:ring-primary focus:border-primary"
                value={filters.cognizable || ''}
                onChange={e => setFilters({ ...filters, cognizable: e.target.value })}
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>

        {/* Court */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Court Type</h3>
          <select 
            className="w-full text-sm border-border rounded-md bg-surface text-text-primary focus:ring-primary focus:border-primary"
            value={filters.court || ''}
            onChange={e => setFilters({ ...filters, court: e.target.value })}
          >
            <option value="">All Courts</option>
            {COURTS.map(court => (
              <option key={court} value={court}>{court}</option>
            ))}
          </select>
        </div>

        <Button className="w-full" onClick={onApply}>Apply Filters</Button>
      </div>
    </aside>
  );
}
