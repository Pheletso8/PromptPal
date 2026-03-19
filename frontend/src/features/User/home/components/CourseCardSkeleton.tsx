import { Skeleton } from '../../../../components/ui/Skeleton';

const CourseCardSkeleton = () => {
  return (
    <div className="group relative rounded-3xl border border-white/5 bg-white/2 overflow-hidden flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative h-44 bg-white/5">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Title area */}
        <div className="space-y-2">
          <Skeleton className="w-full h-5 rounded-md" />
          <Skeleton className="w-2/3 h-5 rounded-md" />
        </div>
        
        <div className="mt-auto space-y-6">
          {/* Progress area */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="w-12 h-2 rounded-full" />
              <Skeleton className="w-8 h-2 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          
          {/* Footer area */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-2 rounded-full" />
            <Skeleton className="w-12 h-3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
