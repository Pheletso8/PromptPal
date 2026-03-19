import { Skeleton } from '../../../../components/ui/Skeleton';

const LeaderboardRowSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4">
        {/* Rank skeleton */}
        <Skeleton className="w-8 h-8 rounded-full" />
        {/* Name skeleton */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-4 rounded-md" />
          <Skeleton className="w-20 h-3 rounded-md opacity-50" />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Stats skeletons */}
        <div className="text-right space-y-2">
          <Skeleton className="w-12 h-3 rounded-full" />
          <Skeleton className="w-16 h-2 rounded-full opacity-50" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export default LeaderboardRowSkeleton;
