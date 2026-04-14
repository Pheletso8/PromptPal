import { Skeleton } from '../../../../components/ui/Skeleton';

const CourseCardSkeleton = () => {
  return (
    <div className="group relative rounded-[2rem] bg-white flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      {/* Thumbnail Area */}
      <div className="relative h-48 m-3 overflow-hidden rounded-[1.5rem] bg-brand-secondary/5">
        <Skeleton className="w-full h-full rounded-none opacity-50" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="w-20 h-7 rounded-full opacity-60" />
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col flex-grow space-y-4">
        {/* Title area */}
        <div className="space-y-3">
          <Skeleton className="w-full h-7 rounded-lg opacity-40" />
          <Skeleton className="w-2/3 h-7 rounded-lg opacity-20" />
        </div>
        
        <div className="mt-auto space-y-5">
          {/* Progress area */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <Skeleton className="w-24 h-3 rounded-full opacity-30" />
              <Skeleton className="w-8 h-3 rounded-full opacity-40" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full opacity-20" />
          </div>
          
          {/* Footer area */}
          <div className="flex items-center justify-between border-t border-gray-50 pt-3">
            <Skeleton className="w-24 h-3 rounded-full opacity-20" />
            <Skeleton className="w-10 h-10 rounded-full opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
