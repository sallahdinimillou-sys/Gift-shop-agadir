
"use client"

import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6 h-[380px] animate-pulse">
          <Skeleton className="aspect-square w-full rounded-2xl bg-white/5" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-1/4 bg-white/5" />
            <Skeleton className="h-6 w-3/4 bg-white/5" />
            <Skeleton className="h-8 w-1/2 bg-white/5 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
