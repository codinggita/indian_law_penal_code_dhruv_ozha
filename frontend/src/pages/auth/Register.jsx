import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Lock, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
});

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user'
    }
  });

  const selectedRole = watch('role');

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (responsePayload) => {
      setAuth(responsePayload.data.user, responsePayload.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to create account. Please try again.';
      toast.error(message);
    }
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-card border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-text-primary">Create Account</h2>
          <p className="text-text-secondary mt-2 text-center">
            Join LexIndia to unlock personalized legal research tools.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={User}
            error={errors.name?.message}
            {...register('name')}
          />

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

          {/* Role selector - primarily for demonstration/testing in this scope */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-text-primary mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`
                border rounded-lg p-4 cursor-pointer transition-all text-center
                ${selectedRole === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface text-text-secondary hover:border-text-muted'}
              `}>
                <input type="radio" value="user" {...register('role')} className="sr-only" />
                <span className="font-medium">Standard User</span>
              </label>
              <label className={`
                border rounded-lg p-4 cursor-pointer transition-all text-center
                ${selectedRole === 'admin' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface text-text-secondary hover:border-text-muted'}
              `}>
                <input type="radio" value="admin" {...register('role')} className="sr-only" />
                <span className="font-medium">Admin (Demo)</span>
              </label>
            </div>
            {errors.role?.message && (
              <p className="mt-1 text-sm text-error">{errors.role.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            size="lg"
            loading={registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary border-t border-border pt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
