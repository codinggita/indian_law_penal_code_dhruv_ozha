import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { createLaw } from '../../api/laws.api';
import LawForm from '../../components/admin/LawForm';

export default function AdminAddLaw() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: createLaw,
    onSuccess: () => {
      toast.success('Law record created successfully');
      queryClient.invalidateQueries({ queryKey: ['laws'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      navigate('/admin');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to create law';
      toast.error(message);
    }
  });

  const handleSubmit = (data) => {
    // Format numeric fields if necessary
    const payload = {
      ...data,
      chapter: data.chapter ? Number(data.chapter) : undefined
    };
    addMutation.mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <Link 
          to="/admin" 
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-display font-bold text-text-primary">Add New Law</h1>
        <p className="text-text-secondary mt-1">Create a new legal record in the database.</p>
      </div>

      <LawForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin')}
        isLoading={addMutation.isPending}
      />
    </div>
  );
}
