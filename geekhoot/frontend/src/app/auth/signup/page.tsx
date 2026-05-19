'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  email: z.string().email('Enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Must contain lowercase')
    .regex(/(?=.*[A-Z])/, 'Must contain uppercase')
    .regex(/(?=.*\d)/, 'Must contain a number'),
  confirmPassword: z.string(),
  houseName: z.string().optional(),
  street: z.string().optional(),
  landmark: z.string().optional(),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const requestGPS = () => {
    if (!navigator.geolocation) { toast.error('GPS not supported'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location captured!');
        setGpsLoading(false);
      },
      () => { toast.error('Location permission denied'); setGpsLoading(false); }
    );
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: res } = await api.post('/auth/signup', {
        ...data,
        ...(coords && { latitude: coords.lat, longitude: coords.lng }),
      });
      if (res.accessToken) localStorage.setItem('access_token', res.accessToken);
      setUser(res.user);
      toast.success('Account created! Welcome to Geekhoot 🎉');
      router.push('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Signup failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-2xl">Geekhoot</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-[var(--fg-muted)] mt-1">Join thousands of happy customers</p>
        </div>

        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Personal Info */}
            <div>
              <h2 className="font-semibold text-sm text-[var(--fg-muted)] uppercase tracking-wide mb-3">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input {...register('name')} label="Full Name" placeholder="John Doe" required error={errors.name?.message} />
                <Input {...register('phone')} label="Phone Number" placeholder="9876543210" required error={errors.phone?.message} type="tel" />
                <Input {...register('email')} label="Email Address" placeholder="john@example.com" required error={errors.email?.message} type="email" className="sm:col-span-2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="font-semibold text-sm text-[var(--fg-muted)] uppercase tracking-wide mb-3">Security</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    {...register('password')}
                    label="Password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 chars, upper, lower, number"
                    required
                    error={errors.password?.message}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-[var(--fg-muted)]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Input
                  {...register('confirmPassword')}
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="font-semibold text-sm text-[var(--fg-muted)] uppercase tracking-wide mb-3">Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input {...register('houseName')} label="House Name / No." placeholder="Beach House, #42" error={errors.houseName?.message} />
                <Input {...register('street')} label="Street / Area" placeholder="MG Road, Kochi" error={errors.street?.message} />
                <Input {...register('landmark')} label="Landmark" placeholder="Near Lulu Mall" error={errors.landmark?.message} />
                <Input {...register('district')} label="District" placeholder="Ernakulam" required error={errors.district?.message} />
                <Input {...register('state')} label="State" placeholder="Kerala" required error={errors.state?.message} />
                <Input {...register('pincode')} label="Pincode" placeholder="682001" required error={errors.pincode?.message} />
              </div>

              {/* GPS */}
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                <MapPin className={`w-5 h-5 shrink-0 ${coords ? 'text-green-500' : 'text-[var(--fg-muted)]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{coords ? '✅ Location captured' : 'Add GPS location'}</p>
                  <p className="text-xs text-[var(--fg-muted)]">Helps with faster and more accurate delivery</p>
                </div>
                <button
                  type="button"
                  onClick={requestGPS}
                  disabled={gpsLoading || !!coords}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60 transition-colors"
                >
                  {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : coords ? 'Captured' : 'Allow GPS'}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--fg-muted)] mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-500 font-medium hover:text-brand-600">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
