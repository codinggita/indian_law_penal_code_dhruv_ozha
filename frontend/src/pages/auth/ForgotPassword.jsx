import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = (data) => {
    // In a real app, you would call your API here
    // e.g., await axiosInstance.post('/auth/forgot-password', data);
    console.log('Reset password link sent to:', data.email);
    setIsSubmitted(true);
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-card border border-border text-center">
        {!isSubmitted ? (
          <>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Forgot Password</h2>
            <p className="text-text-secondary mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary mb-8">
              We've sent a password reset link to your email address. Please check your inbox.
            </p>
          </>
        )}

        <div className="mt-8 border-t border-border pt-6">
          <Link to="/login" className="inline-flex items-center font-medium text-text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
