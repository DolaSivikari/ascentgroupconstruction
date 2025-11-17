import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Skeleton */}
      <Skeleton className="absolute inset-0" />
      
      {/* Content Skeleton */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="max-w-4xl space-y-6">
          {/* Stat Badge */}
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Headline */}
          <Skeleton className="h-16 w-full max-w-2xl" />
          <Skeleton className="h-16 w-full max-w-xl" />

          {/* Subheadline */}
          <Skeleton className="h-6 w-full max-w-3xl" />
          <Skeleton className="h-6 w-full max-w-2xl" />

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-12 w-40 rounded-md" />
            <Skeleton className="h-12 w-40 rounded-md" />
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-12">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-2 w-12 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
