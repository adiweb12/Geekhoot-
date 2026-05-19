import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm active:scale-[0.98]',
  secondary: 'bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)]',
  ghost: 'hover:bg-[var(--bg-secondary)] text-[var(--fg)]',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
