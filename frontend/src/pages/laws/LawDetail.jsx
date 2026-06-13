import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Bookmark, Share2, Scale, Clock, Edit, Trash2, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLawById, archiveLaw, deleteLaw } from '../../api/laws.api';
import { useAuthStore } from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function LawDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, role } = useAuthStore();

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['law', id],
    queryFn: () => getLawById(id),
  });

  const law = response?.data;

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { getBookmarks } = await import('../../api/auth.api');
      return getBookmarks();
    },
    enabled: isAuthenticated
  });

  const bookmarks = bookmarksData?.data || [];
  // bookmarks could be an array of populated Law objects or just IDs, let's handle both
  const isBookmarked = bookmarks.some(b => b._id === id || b === id);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const { toggleBookmark } = await import('../../api/auth.api');
      return toggleBookmark(id);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      refetch(); // Refetch law to update bookmark count
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to toggle bookmark');
    }
  });

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark laws');
      navigate('/login');
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteLaw(id),
    onSuccess: () => {
      toast.success('Law deleted successfully');
      navigate('/laws');
    },
    onError: () => toast.error('Failed to delete law')
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this law? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center py-32">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !law) {
    return (
      <PageWrapper>
        <EmptyState 
          title="Law not found" 
          description="The law you are looking for may have been removed or the URL is incorrect."
          actionText="Back to Browse"
          onAction={() => navigate('/laws')}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`Section ${law.sectionNumber} - ${law.title}`}>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-text-muted mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li>
              <Link to="/laws" className="hover:text-primary transition-colors">Laws</Link>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-text-primary font-medium" aria-current="page">
              Section {law.sectionNumber}
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-mono text-lg text-primary bg-primary/10 px-3 py-1 rounded-md">
              Section {law.sectionNumber}
            </span>
            <span className="text-sm font-semibold tracking-widest uppercase text-text-secondary">
              {law.actName}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
            {law.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {law.category && <Badge variant="category">{law.category}</Badge>}
            {law.court && <Badge variant="category">{law.court}</Badge>}
            {law.state && <Badge variant="category">{law.state}</Badge>}
            <Badge variant={law.bailable ? "bailable" : "non-bailable"}>
              {law.bailable ? 'Bailable' : 'Non-Bailable'}
            </Badge>
            <Badge variant={law.cognizable ? "category" : "category"}>
              {law.cognizable ? 'Cognizable' : 'Non-Cognizable'}
            </Badge>
            <Badge variant="category">
              {law.compoundable ? 'Compoundable' : 'Non-Compoundable'}
            </Badge>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between py-4 border-y border-border mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBookmark}
              className={`flex items-center space-x-2 transition-colors ${isBookmarked ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="font-medium text-sm">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium text-sm">Share</span>
            </button>
          </div>

          {role === 'admin' && (
            <div className="flex items-center space-x-3">
              <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/laws/${id}/edit`)} icon={Edit}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={handleDelete} icon={Trash2} loading={deleteMutation.isPending}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-10">
          <div className="prose prose-lg max-w-none text-text-secondary">
            <h3 className="text-2xl font-display font-bold text-text-primary mb-4">Description</h3>
            <div className="bg-surface p-6 rounded-xl border border-border leading-relaxed whitespace-pre-wrap">
              {law.description}
            </div>
          </div>

          {law.punishment && (
            <div>
              <h3 className="text-2xl font-display font-bold text-text-primary mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-primary" />
                Punishment & Penalties
              </h3>
              <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-primary shadow-sm">
                <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
                  {law.punishment}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
