'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, MapPin, Lock, Package, Heart, LogOut, Save, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 chars'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid Indian phone number required'),
  houseName: z.string().optional(),
  street: z.string().optional(),
  landmark: z.string().optional(),
  district: z.string().min(1, 'District required'),
  state: z.string().min(1, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit pincode required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'At least 8 characters').regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, 'Must contain uppercase, lowercase, number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

type TabId = 'profile' | 'password';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [saving, setSaving] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      houseName: user?.houseName || '',
      street: user?.street || '',
      landmark: user?.landmark || '',
      district: user?.district || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-4">Sign in to view your profile</h2>
        <Link href="/auth/login"><Button size="lg">Sign In</Button></Link>
      </div>
    );
  }

  const onSaveProfile = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const { data: res } = await api.patch('/users/profile', data);
      setUser({ ...user, ...res.data });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setSaving(true);
    try {
      await api.post('/users/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      passwordForm.reset();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to change password';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile & Address', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-brand-500/30">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-[var(--fg-muted)]">{user.email}</p>
          {user.role === 'ADMIN' && (
            <span className="text-xs bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">Admin</span>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { href: '/orders', icon: Package, label: 'My Orders' },
          { href: '/profile/wishlist', icon: Heart, label: 'Wishlist' },
          ...(user.role === 'ADMIN' ? [{ href: '/admin', icon: User, label: 'Admin Panel' }] : []),
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-brand-300 hover:text-brand-500 transition-all text-sm font-medium group"
          >
            <Icon className="w-4 h-4" />
            {label}
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl mb-6 border border-[var(--border)]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-[var(--bg)] shadow-sm text-[var(--fg)]' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'profile' && (
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-5">
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] space-y-4">
              <h2 className="font-semibold text-sm text-[var(--fg-muted)] uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Info
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input {...profileForm.register('name')} label="Full Name" error={profileForm.formState.errors.name?.message} />
                <Input {...profileForm.register('phone')} label="Phone Number" error={profileForm.formState.errors.phone?.message} />
              </div>
              <Input value={user.email} label="Email" disabled className="opacity-60 cursor-not-allowed" />
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] space-y-4">
              <h2 className="font-semibold text-sm text-[var(--fg-muted)] uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input {...profileForm.register('houseName')} label="House Name / No." error={profileForm.formState.errors.houseName?.message} />
                <Input {...profileForm.register('street')} label="Street / Area" error={profileForm.formState.errors.street?.message} />
                <Input {...profileForm.register('landmark')} label="Landmark" error={profileForm.formState.errors.landmark?.message} />
                <Input {...profileForm.register('district')} label="District" required error={profileForm.formState.errors.district?.message} />
                <Input {...profileForm.register('state')} label="State" required error={profileForm.formState.errors.state?.message} />
                <Input {...profileForm.register('pincode')} label="Pincode" required error={profileForm.formState.errors.pincode?.message} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" isLoading={saving} className="flex-1 sm:flex-none sm:w-40">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] space-y-4">
              <h2 className="font-semibold text-sm text-[var(--fg-muted)] uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4" /> Change Password
              </h2>
              <Input
                {...passwordForm.register('currentPassword')}
                label="Current Password"
                type="password"
                required
                error={passwordForm.formState.errors.currentPassword?.message}
              />
              <Input
                {...passwordForm.register('newPassword')}
                label="New Password"
                type="password"
                required
                error={passwordForm.formState.errors.newPassword?.message}
              />
              <Input
                {...passwordForm.register('confirmPassword')}
                label="Confirm New Password"
                type="password"
                required
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
              <Button type="submit" isLoading={saving} className="w-full sm:w-40">
                Update Password
              </Button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Sign Out */}
      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <button
          onClick={async () => { await logout(); router.push('/'); }}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
