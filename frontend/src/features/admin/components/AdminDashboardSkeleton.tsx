import { Skeleton } from '../../../components/ui/Skeleton';
import { LayoutGrid, TrendingUp, Award } from 'lucide-react';

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <Skeleton className="w-64 h-10 rounded-xl" />
            <Skeleton className="w-80 h-4 rounded-lg opacity-50" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="w-40 h-12 rounded-xl" />
            <Skeleton className="w-32 h-12 rounded-xl" />
          </div>
        </div>

        {/* Quick Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white border border-brand-primary/10 p-6 rounded-2xl shadow-sm">
              <Skeleton className="w-12 h-12 rounded-xl mb-4" />
              <Skeleton className="w-24 h-3 rounded-full mb-2 opacity-50" />
              <Skeleton className="w-16 h-8 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Pulse Chart Skeleton */}
          <div className="bg-white border border-brand-primary/10 p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-text/30" />
                <Skeleton className="w-40 h-6 rounded-lg" />
              </div>
              <Skeleton className="w-12 h-6 rounded-lg opacity-30" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-2xl opacity-10" />
          </div>

          {/* Success Metrics Chart Skeleton */}
          <div className="bg-white border border-brand-primary/10 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <Award className="w-5 h-5 text-brand-text/30" />
              <Skeleton className="w-48 h-6 rounded-lg" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-2xl opacity-10" />
          </div>

          {/* Enrollment Distribution Skeleton */}
          <div className="bg-white border border-brand-primary/10 p-8 rounded-3xl shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <LayoutGrid className="w-5 h-5 text-brand-text/30" />
              <Skeleton className="w-56 h-6 rounded-lg" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl opacity-10" />
          </div>
        </div>

        {/* Mastery Matrix Skeleton */}
        <div className="bg-white border border-brand-primary/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-brand-primary/5 flex justify-between items-center bg-brand-secondary/5">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-32 h-4 rounded-lg opacity-50" />
          </div>
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-brand-primary/5 last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-40 h-4 rounded-lg" />
                </div>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="w-4 h-4 rounded-full opacity-10" />
                  ))}
                  <Skeleton className="w-16 h-6 rounded-lg opacity-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardSkeleton;
