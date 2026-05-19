'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const schema = z.object({
  identifier: z.string().min(1, 'Email or phone required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.identifier, data.password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-2xl">Geekhoot</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-[var(--fg-muted)] mt-1">Sign in to your account</p>
        </div>

        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--border)] p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('identifier')}
              label="Email or Phone"
              placeholder="you@example.com or 9876543210"
              icon={<Mail className="w-4 h-4" />}
              error={errors.identifier?.message}
              autoComplete="username"
            />

            <div className="relative">
              <Input
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[var(--fg-muted)] hover:text-[var(--fg)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--fg-muted)] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-brand-500 font-medium hover:text-brand-600">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
