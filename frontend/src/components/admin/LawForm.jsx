import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { CATEGORIES, COURTS, STATES } from '../../utils/constants';
import Input from '../ui/Input';
import Button from '../ui/Button';

const lawSchema = z.object({
  sectionNumber: z.string().min(1, 'Section number is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description is required and must be detailed'),
  punishment: z.string().optional(),
  actName: z.string().min(1, 'Act Name is required'),
  category: z.string().optional(),
  chapter: z.union([z.string(), z.number()]).optional(),
  bailable: z.boolean().default(false),
  cognizable: z.boolean().default(false),
  compoundable: z.boolean().default(false),
  court: z.string().optional(),
  state: z.string().optional(),
});

export default function LawForm({ initialData, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(lawSchema),
    defaultValues: {
      sectionNumber: initialData?.sectionNumber || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      punishment: initialData?.punishment || '',
      actName: initialData?.actName || 'Indian Penal Code (IPC)',
      category: initialData?.category || '',
      chapter: initialData?.chapter || '',
      bailable: initialData?.bailable || false,
      cognizable: initialData?.cognizable || false,
      compoundable: initialData?.compoundable || false,
      court: initialData?.court || '',
      state: initialData?.state || 'All India',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface p-6 sm:p-8 rounded-xl border border-border shadow-sm">
      
      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Section Number *"
            placeholder="e.g. 302"
            error={errors.sectionNumber?.message}
            {...register('sectionNumber')}
          />
          <Input
            label="Act Name *"
            placeholder="e.g. Indian Penal Code (IPC)"
            error={errors.actName?.message}
            {...register('actName')}
          />
        </div>

        <Input
          label="Law Title *"
          placeholder="e.g. Punishment for murder"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Description *</label>
          <textarea
            className={`w-full rounded-md border text-text-primary bg-surface shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 min-h-[150px] ${
              errors.description ? 'border-error focus:ring-error' : 'border-border'
            }`}
            placeholder="Detailed text of the law..."
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-sm text-error">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Punishment & Penalties</label>
          <textarea
            className="w-full rounded-md border border-border text-text-primary bg-surface shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm px-3 py-2 min-h-[100px]"
            placeholder="Details about fines, imprisonment, etc."
            {...register('punishment')}
          />
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Classification & Attributes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
            <select
              className="w-full rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary sm:text-sm px-3 py-2"
              {...register('category')}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <Input
            label="Chapter"
            type="number"
            placeholder="e.g. 16"
            {...register('chapter')}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Court Jurisdiction</label>
            <select
              className="w-full rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary sm:text-sm px-3 py-2"
              {...register('court')}
            >
              <option value="">Select Court</option>
              {COURTS.map(court => <option key={court} value={court}>{court}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">State Applicability</label>
          <select
            className="w-full rounded-md border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary sm:text-sm px-3 py-2"
            {...register('state')}
          >
            <option value="All India">All India</option>
            {STATES.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-6 pt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-5 w-5" {...register('bailable')} />
            <span className="text-sm font-medium text-text-primary">Bailable</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-5 w-5" {...register('cognizable')} />
            <span className="text-sm font-medium text-text-primary">Cognizable</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-5 w-5" {...register('compoundable')} />
            <span className="text-sm font-medium text-text-primary">Compoundable</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading} icon={X}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isLoading} icon={Save}>
          {initialData ? 'Save Changes' : 'Create Law'}
        </Button>
      </div>

    </form>
  );
}
