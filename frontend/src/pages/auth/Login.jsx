import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (responsePayload) => {
      setAuth(responsePayload.data.user, responsePayload.data.token);
      toast.success('Successfully logged in!');
      navigate('/');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to login. Please check your credentials.';
      toast.error(message);
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-card border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-text-primary">Welcome Back</h2>
          <p className="text-text-secondary mt-2 text-center">
            Sign in to bookmark laws and save your search history.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
              <span className="ml-2 text-sm text-text-secondary">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary border-t border-border pt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Create a free account
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
