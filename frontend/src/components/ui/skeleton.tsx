import { cn } from '@/lib/utils';

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-2" />
        <Skeleton className="h-9 w-full mt-3" />
      </div>
    </div>
  );
}
