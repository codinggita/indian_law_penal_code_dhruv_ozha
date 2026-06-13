import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // In reality, you'd verify this token

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = (data) => {
    // In a real app, you would call your API here
    // e.g., await axiosInstance.post(`/auth/reset-password/${token}`, { password: data.password });
    toast.success('Password successfully reset!');
    navigate('/login');
  };

  if (!token) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">Invalid Reset Link</h2>
          <p className="text-text-secondary mb-4">The password reset link is invalid or has expired.</p>
          <Link to="/forgot-password">
            <Button>Request new link</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-card border border-border">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Reset Password</h2>
          <p className="text-text-secondary">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full mt-6" size="lg">
            Reset Password
          </Button>
        </form>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <Link to="/login" className="inline-flex items-center font-medium text-text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
