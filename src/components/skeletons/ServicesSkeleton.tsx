import { Skeleton } from "@/components/ui/skeleton";

export const ServicesSkeleton = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 justify-center flex-wrap">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full" />
          ))}
        </div>

        {/* Service Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full rounded-md mt-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
