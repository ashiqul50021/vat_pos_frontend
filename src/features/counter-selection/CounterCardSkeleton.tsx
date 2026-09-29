import React from 'react';

export const CounterCardSkeleton: React.FC = () => {
  return (
    <div className="relative bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between overflow-hidden animate-pulse select-none">
      {/* Top Accent Bar Skeleton */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200" />

      <div>
        {/* Row 1: Icon + Title & Subtitle + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Category Icon Box Skeleton */}
            <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />

            {/* Title & Department Subtitle Skeleton */}
            <div className="space-y-1.5 min-w-0">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-3 w-20 bg-slate-100 rounded-md" />
            </div>
          </div>

          {/* Status Badge Skeleton */}
          <div className="h-6 w-20 bg-slate-200 rounded-full shrink-0" />
        </div>

        {/* Row 2: Code Pill, Floor Location & IP Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-16 bg-slate-200 rounded-md" />
          <div className="h-4 w-24 bg-slate-100 rounded-md" />
          <div className="h-3.5 w-16 bg-slate-100 rounded-md ml-auto hidden sm:block" />
        </div>
      </div>

      {/* Action CTA Button Skeleton */}
      <div className="w-full h-10 rounded-xl bg-slate-200 mt-2" />
    </div>
  );
};
