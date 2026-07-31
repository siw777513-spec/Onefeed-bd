import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="p-3 rounded-2xl bg-[#121220] border border-white/10 space-y-3 animate-pulse mb-3">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-white/10 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="w-28 h-3 rounded bg-white/10" />
          <div className="w-16 h-2.5 rounded bg-white/5" />
        </div>
      </div>

      {/* Image Media Skeleton */}
      <div className="w-full aspect-[4/3] rounded-xl bg-white/10" />

      {/* Caption Line */}
      <div className="space-y-1.5">
        <div className="w-3/4 h-3 rounded bg-white/10" />
        <div className="w-1/2 h-3 rounded bg-white/5" />
      </div>

      {/* Footer Bar */}
      <div className="flex justify-between pt-2 border-t border-white/5">
        <div className="w-12 h-4 rounded bg-white/10" />
        <div className="w-12 h-4 rounded bg-white/10" />
        <div className="w-12 h-4 rounded bg-white/10" />
      </div>
    </div>
  );
};
