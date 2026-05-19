import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-display font-bold text-brand-100 dark:text-brand-900/30 select-none">404</p>
      <h1 className="text-2xl font-bold -mt-4 mb-2">Page Not Found</h1>
      <p className="text-[var(--fg-muted)] mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors">
          Go Home
        </Link>
        <Link href="/products" className="px-5 py-2.5 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--bg-secondary)] transition-colors">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
