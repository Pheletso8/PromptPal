import { Skeleton } from '../../../../components/ui/Skeleton';

const CourseCardSkeleton = () => {
  return (
    <div className="group relative rounded-[2rem] border border-brand-primary/10 bg-white overflow-hidden flex flex-col h-full shadow-sm">
      {/* Thumbnail Area */}
      <div className="relative h-44 bg-brand-secondary/5">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow space-y-4">
        {/* Title area */}
        <div className="space-y-3">
          <Skeleton className="w-full h-6 rounded-lg opacity-40" />
          <Skeleton className="w-2/3 h-6 rounded-lg opacity-20" />
        </div>
        
        <div className="mt-auto space-y-8">
          {/* Progress area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="w-16 h-2 rounded-full opacity-30" />
              <Skeleton className="w-8 h-2 rounded-full opacity-40" />
            </div>
            <Skeleton className="h-2 w-full rounded-full opacity-10" />
          </div>
          
          {/* Footer area */}
          <div className="flex items-center justify-between border-t border-brand-primary/5 pt-4">
            <Skeleton className="w-24 h-3 rounded-full opacity-20" />
            <Skeleton className="w-16 h-4 rounded-full opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
