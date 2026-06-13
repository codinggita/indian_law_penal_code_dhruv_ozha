import { Scale } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ 
  icon: Icon = Scale, 
  title = 'No results found', 
  description = 'Try adjusting your filters or search query to find what you are looking for.',
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-border rounded-lg shadow-sm">
      <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary opacity-80" />
      </div>
      <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary max-w-sm mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
