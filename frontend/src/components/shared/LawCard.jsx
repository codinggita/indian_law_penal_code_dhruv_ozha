import { Link } from 'react-router-dom';
import { Eye, Scale } from 'lucide-react';
import Badge from '../ui/Badge';

export default function LawCard({ law }) {
  return (
    <Link 
      to={`/laws/${law._id}`}
      className="block bg-surface border border-border rounded-xl p-6 hover:shadow-card hover:border-primary transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="font-mono text-sm text-text-muted bg-surface-2 px-2 py-1 rounded">
          Section {law.sectionNumber}
        </span>
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {law.actName}
        </span>
      </div>
      
      <h3 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {law.title}
      </h3>
      
      <p className="text-text-secondary text-sm mb-4 line-clamp-3">
        {law.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {law.category && <Badge variant="category">{law.category}</Badge>}
        {law.bailable ? (
          <Badge variant="bailable">Bailable</Badge>
        ) : (
          <Badge variant="non-bailable">Non-Bailable</Badge>
        )}
        {law.cognizable && <Badge variant="category">Cognizable</Badge>}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center text-text-muted text-sm">
          <Scale className="w-4 h-4 mr-1" />
          <span>{law.court || 'Various Courts'}</span>
        </div>
        <div className="flex items-center text-text-muted text-sm">
          <Eye className="w-4 h-4 mr-1" />
          <span>{law.views || 0}</span>
        </div>
      </div>
    </Link>
  );
}
