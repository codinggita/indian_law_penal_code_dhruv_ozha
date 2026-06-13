import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLawById, updateLaw } from '../../api/laws.api';
import LawForm from '../../components/admin/LawForm';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function AdminEditLaw() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['law', id],
    queryFn: () => getLawById(id),
  });

  const editMutation = useMutation({
    mutationFn: (data) => updateLaw(id, data),
    onSuccess: () => {
      toast.success('Law record updated successfully');
      queryClient.invalidateQueries({ queryKey: ['law', id] });
      queryClient.invalidateQueries({ queryKey: ['laws'] });
      navigate(`/laws/${id}`);
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to update law';
      toast.error(message);
    }
  });

  const handleSubmit = (data) => {
    // Format numeric fields if necessary
    const payload = {
      ...data,
      chapter: data.chapter ? Number(data.chapter) : undefined
    };
    editMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="py-12">
        <EmptyState 
          title="Law not found" 
          description="We couldn't find the law record you're trying to edit."
          actionText="Back to Dashboard"
          onAction={() => navigate('/admin')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <Link 
          to={`/laws/${id}`} 
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Law Details
        </Link>
        <h1 className="text-3xl font-display font-bold text-text-primary">Edit Law Record</h1>
        <p className="text-text-secondary mt-1">Updating Section {response.data.sectionNumber} - {response.data.title}</p>
      </div>

      <LawForm 
        initialData={response.data}
        onSubmit={handleSubmit} 
        onCancel={() => navigate(`/laws/${id}`)}
        isLoading={editMutation.isPending}
      />
    </div>
  );
}
